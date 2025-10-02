package com.example.expensetracker;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.repository.ExpenseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner initData(ExpenseRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Expense("Food", "Groceries", 45.90, LocalDate.now().minusDays(2)));
                repo.save(new Expense("Transport", "Bus Pass", 25.00, LocalDate.now().minusDays(5)));
                repo.save(new Expense("Entertainment", "Movies", 15.50, LocalDate.now().minusDays(1)));
                repo.save(new Expense("Utilities", "Electric Bill", 60.00, LocalDate.now().minusDays(10)));
            }
        };
    }
}