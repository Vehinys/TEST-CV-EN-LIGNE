# Règle : Symfony 7.x — Conventions strictes

> Source officielle : https://symfony.com/doc/current/

---

## PHP 8.2+ — Attributs natifs (obligatoires)

```php
// Routes
#[Route('/users/{id}', name: 'user_show', methods: ['GET'])]

// Services
#[Autowire(service: 'cache.app')]
#[AsService]
#[AsAlias(id: InterfaceName::class)]

// Messenger
#[AsMessageHandler]

// Events
#[AsEventListener(event: KernelEvents::REQUEST, priority: 10)]

// Security
#[IsGranted('ROLE_ADMIN')]
#[IsGranted('EDIT', subject: 'post')]

// Doctrine
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Column(type: Types::STRING, length: 255, nullable: false)]
#[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'products')]
```

---

## Structure des dossiers (DDD-light)

```
src/
├── Controller/           ← HTTP layer uniquement
│   └── Api/              ← Contrôleurs API REST
├── Entity/               ← Doctrine entities (anémiques)
├── Repository/           ← Data access (QueryBuilder)
├── Service/              ← Business logic
├── Message/              ← Commands / Queries / Events (Messenger)
│   ├── Command/
│   ├── Query/
│   └── Event/
├── MessageHandler/       ← Handlers Messenger
├── Form/                 ← Symfony Forms + DTOs
├── Security/             ← Voters, Authenticators, Guards
├── EventListener/        ← Event Subscribers/Listeners
├── DTO/                  ← Data Transfer Objects (lecture seule)
└── Exception/            ← Exceptions métier custom

config/
├── packages/             ← Configuration des bundles
├── routes/               ← Routing YAML (si pas d'attributs)
└── services.yaml         ← Déclarations manuelles

templates/                ← Twig (voir rules/twig.md)
translations/             ← FR + EN (YAML)
migrations/               ← Doctrine migrations
tests/
├── Unit/
├── Integration/
└── Functional/           ← WebTestCase
```

---

## Controllers — Règles strictes

```php
final class UserController extends AbstractController
{
    public function __construct(
        private readonly UserService $userService,
    ) {}

    #[Route('/users', name: 'user_index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('user/index.html.twig', [
            'users' => $this->userService->findAll(),
        ]);
    }
}
```

**INTERDIT dans les controllers :**
- Requêtes Doctrine directes
- Logique métier
- `new` d'entités complexes (passer par une factory/service)

---

## Doctrine — Règles strictes

```php
// Repository
final class UserRepository extends ServiceEntityRepository
{
    public function findActiveByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->andWhere('u.active = true')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
```

- `find*` UNIQUEMENT dans les Repository
- `$em->flush()` UNIQUEMENT dans les Services (jamais dans les entités)
- Transactions explicites : `$em->wrapInTransaction(function() {...})`
- N+1 : utiliser `JOIN FETCH` ou `addSelect` dans QueryBuilder
- Détecter via Symfony Profiler (onglet Doctrine)

---

## Symfony Messenger — Pattern CQRS

```php
// Command (écriture, effet de bord)
final class CreateUserCommand
{
    public function __construct(
        public readonly string $email,
        public readonly string $plainPassword,
    ) {}
}

// Handler
#[AsMessageHandler]
final class CreateUserCommandHandler
{
    public function __invoke(CreateUserCommand $command): void
    {
        // ...logique métier...
    }
}

// Dispatch
$this->messageBus->dispatch(new CreateUserCommand($email, $password));
```

- **Command** → effet de bord (écriture, modification état)
- **Query** → lecture seule, retourne un DTO
- **Event** → notification, découplage, async possible

---

## Symfony Mailer

```php
$email = (new TemplatedEmail())
    ->from(new Address('noreply@app.com', 'App Name'))
    ->to($user->getEmail())
    ->subject($this->translator->trans('mail.welcome.subject'))
    ->htmlTemplate('emails/welcome.html.twig')
    ->textTemplate('emails/welcome.txt.twig')
    ->context(['user' => $user]);

$this->mailer->send($email);
```

- TOUJOURS `TemplatedEmail` (jamais `Email` brut pour les mails utilisateurs)
- Fournir systématiquement un template `.txt.twig` (accessibilité)
- Tests : `$this->assertEmailCount(1)` + `KernelBrowser::getMailerMessages()`

---

## Sécurité

```php
// Voter
final class PostVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, ['VIEW', 'EDIT']) && $subject instanceof Post;
    }
}

// Contraintes Assert
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\Email]
#[Assert\NotBlank]
#[Assert\Length(max: 180)]
private string $email;
```

- **CSRF** : `{{ csrf_token('action') }}` + `isCsrfTokenValid()` dans le controller
- **Voters** pour toute autorisation granulaire
- **Assert** sur toutes les entités et DTOs
- Jamais de `$_GET`/`$_POST` directs — utiliser `$request->query->get()` (typé)

---

## Tests

```php
// WebTestCase (fonctionnel)
final class UserControllerTest extends WebTestCase
{
    public function testCreateUser(): void
    {
        $client = static::createClient();
        $client->request('POST', '/users', [...]);
        $this->assertResponseIsSuccessful();
    }
}

// KernelTestCase (intégration)
final class UserServiceTest extends KernelTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
        $this->service = self::getContainer()->get(UserService::class);
    }
}
```

- `WebTestCase` → controllers, routes, réponses HTTP
- `KernelTestCase` → services, intégration avec vrais composants
- **Foundry** pour les fixtures et factories
- Coverage minimum : **80%** lignes
- Pas de mocks de base de données (base de test dédiée)

---

## Anonymisation CNIL (obligatoire à la désinscription)

```php
public function anonymizeUser(User $user): void
{
    $user->setEmail('anon_' . bin2hex(random_bytes(8)) . '@deleted.invalid');
    $user->setFirstName('Anonyme');
    $user->setLastName('Anonyme');
    $user->setPassword(''); // Invalider le mot de passe
    $user->setAnonymizedAt(new \DateTimeImmutable());
    // Supprimer ou anonymiser toutes les données personnelles liées
}
```

---

## Références

- Symfony 7 : https://symfony.com/doc/current/
- Doctrine : https://www.doctrine-project.org/projects/orm.html
- Messenger : https://symfony.com/doc/current/messenger.html
- Security : https://symfony.com/doc/current/security.html
- PHPUnit : https://phpunit.de/documentation.html
- PHP 8.2 : https://www.php.net/releases/8.2/
