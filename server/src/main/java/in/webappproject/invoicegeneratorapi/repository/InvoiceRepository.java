package in.webappproject.geninvoico.repository;

import in.webappproject.geninvoico.entity.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InvoiceRepository extends MongoRepository<Invoice, String> {



}
