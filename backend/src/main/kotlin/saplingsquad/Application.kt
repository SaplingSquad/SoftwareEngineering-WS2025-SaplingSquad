package saplingsquad

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication


/**
 * Spring boot Root Application
 * Spring Components/Beans are only searched in this package and its subpackages
 * => This class should not be in any sibling package etc.
 */
@SpringBootApplication
class Application

/**
 * Launch Spring boot
 */
fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
