# GenInvoico API - Presentation Q&A

## Architecture & Design

**Q1: What design pattern does this application follow?**
> The application follows a layered architecture pattern with three distinct layers:
> - **Controller Layer** (`InvoiceController.java`) - Handles HTTP requests and responses
> - **Service Layer** (`InvoiceService.java`) - Contains business logic
> - **Repository Layer** (`InvoiceRepository.java`) - Handles data persistence
>
> This separation of concerns makes the code maintainable, testable, and scalable.

**Q2: Why did you choose MongoDB over a relational database?**
> MongoDB is ideal for this invoice application because:
> - Invoices have nested/embedded documents (Company, Billing, Shipping, Items)
> - Schema flexibility allows easy addition of new fields
> - JSON-like document structure maps naturally to the invoice data model
> - No complex joins required - all invoice data is stored in a single document

**Q3: What is the purpose of `@EnableMongoAuditing` in the main application class?**
> It enables automatic population of audit fields like `@CreatedDate` and `@LastModifiedDate`. When an invoice is saved, MongoDB automatically sets the `createdAt` timestamp without manual intervention.

---

## Entity Design

**Q4: Explain the structure of the `Invoice` entity.**
> The Invoice entity uses embedded documents pattern with:
> - `Company` - Seller information (name, phone, address)
> - `Billing` - Buyer billing details
> - `Shipping` - Delivery address information
> - `InvoiceDetails` - Invoice number, date, due date
> - `List<Item>` - Line items with quantity, amount, description
> - Metadata fields: `tax`, `notes`, `logo`, `template`, `thumbnailUrl`

**Q5: What is the purpose of `@Data` annotation from Lombok?**
> `@Data` is a Lombok annotation that automatically generates:
> - Getters for all fields
> - Setters for all non-final fields
> - `toString()` method
> - `equals()` and `hashCode()` methods
> - `@RequiredArgsConstructor`
>
> This reduces boilerplate code significantly.

**Q6: Why are some inner classes `static` and others not?**
> `Company` and `Item` are declared as `static` inner classes, while `Billing`, `Shipping`, and `InvoiceDetails` are non-static. 
> - **Static inner classes** don't hold a reference to the outer class instance
> - **Non-static inner classes** have an implicit reference to the enclosing Invoice instance
> 
> *Note: For consistency and better serialization, all inner classes should ideally be `static`.*

**Q7: What's the difference between `@CreatedDate` and `@LastModifiedDate`?**
> - `@CreatedDate` - Automatically set only once when the document is first created
> - `@LastModifiedDate` - Updated every time the document is modified
>
> *Note: The code uses `@LastModifiedBy` instead of `@LastModifiedDate` for `lastUpdatedAt`, which is incorrect and should be fixed.*

---

## Controller Layer

**Q8: What does `@RestController` annotation do?**
> It combines `@Controller` and `@ResponseBody`, meaning:
> - The class handles HTTP requests
> - All method return values are automatically serialized to JSON and written to the HTTP response body

**Q9: Explain the purpose of `@CrossOrigin("*")`.**
> It enables Cross-Origin Resource Sharing (CORS) for all origins. This allows the React frontend (running on a different port) to make API calls to this backend. In production, you should restrict this to specific domains for security.

**Q10: What HTTP methods are supported and what do they do?**
> | Method | Endpoint | Purpose |
> |--------|----------|---------|
> | POST | `/api/invoices` | Create a new invoice |
> | GET | `/api/invoices` | Retrieve all invoices |
> | DELETE | `/api/invoices/{id}` | Delete an invoice by ID |

**Q11: Why use `ResponseEntity` instead of returning objects directly?**
> `ResponseEntity` provides full control over the HTTP response including:
> - Status codes (`200 OK`, `204 No Content`)
> - Headers
> - Response body
>
> Example: `ResponseEntity.noContent().build()` returns HTTP 204 with no body for delete operations.

---

## Service Layer

**Q12: What is the purpose of `@RequiredArgsConstructor`?**
> It's a Lombok annotation that generates a constructor with all `final` fields as parameters. Combined with Spring's constructor injection, it automatically injects `InvoiceRepository` without needing `@Autowired`.

**Q13: How does the `removeInvoice` method handle non-existent invoices?**
> It first checks if the invoice exists using `findById()`. If not found, it throws a `RuntimeException` with a descriptive message. This prevents silent failures and provides clear error feedback.

```java
Invoice existingInvoice = invoiceRepository.findById(invoiceId)
    .orElseThrow(() -> new RuntimeException("Invoice not found: " + invoiceId));
```

---

## Repository Layer

**Q14: Why is `InvoiceRepository` an interface with no methods?**
> It extends `MongoRepository<Invoice, String>` which provides all basic CRUD operations out of the box:
> - `save()`, `findById()`, `findAll()`, `delete()`, `deleteById()`, etc.
>
> Spring Data MongoDB automatically implements this interface at runtime.

**Q15: What do the generic parameters `<Invoice, String>` mean?**
> - `Invoice` - The entity type this repository manages
> - `String` - The type of the entity's ID field (`@Id private String id`)

---

## Configuration

**Q16: What does the MongoDB connection string contain?**
> The connection string in `application.properties` includes:
> - Protocol: `mongodb+srv://` (DNS seedlist connection format)
> - Credentials: username and password
> - Cluster address: `cluster0.6qwfx2k.mongodb.net`
> - Database name: `MCAJavaProject`
> - Additional parameters: `appName=Cluster0`

**Q17: What Spring Boot version is used and why?**
> Spring Boot 3.5.0 with Java 21. This version provides:
> - Latest security patches
> - Virtual threads support (Java 21)
> - Improved performance
> - Native compilation support

---

## Potential Improvements

**Q18: What improvements would you suggest for this codebase?**
> 1. **Exception Handling** - Add `@ControllerAdvice` for global exception handling
> 2. **Validation** - Add `@Valid` and Bean Validation annotations
> 3. **DTOs** - Use separate DTOs instead of exposing entities directly
> 4. **Pagination** - Add pagination for `fetchInvoices()` endpoint
> 5. **Security** - Implement authentication/authorization
> 6. **Fix Bug** - Change `@LastModifiedBy` to `@LastModifiedDate` in Invoice entity
> 7. **CORS** - Restrict to specific origins in production

---

## Testing

**Q19: What does the `contextLoads()` test verify?**
> It's a smoke test that verifies the Spring application context loads successfully without errors. If any bean fails to initialize or there are configuration issues, this test will fail.

**Q20: How would you test the InvoiceService?**
> Using JUnit 5 with Mockito:
> - Mock `InvoiceRepository`
> - Test `saveInvoice()` returns saved entity
> - Test `fetchInvoices()` returns list
> - Test `removeInvoice()` throws exception for invalid ID
