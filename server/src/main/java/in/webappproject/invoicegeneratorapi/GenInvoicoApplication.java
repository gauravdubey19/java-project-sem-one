package in.webappproject.geninvoico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class GenInvoicoApplication {

	public static void main(String[] args) {
		SpringApplication.run(GenInvoicoApplication.class, args);
	}

}
