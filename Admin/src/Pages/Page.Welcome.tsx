import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--light-foreground)] flex flex-col items-center justify-center p-8">
      <motion.h1
        className="text-4xl font-bold text-[var(--dark-text)] mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to FoodX Management
      </motion.h1>
      <p className="text-lg text-[var(--dark-secondary-text)] dark:text-light-secondary-text mb-8 text-center">
        Streamline your canteen operations efficiently. Access the Admin or Chef
        dashboard to manage tasks effectively.
      </p>

      <div className="flex flex-wrap gap-6 justify-center">
        <motion.div
          className="bg-primary-color text-light-text rounded-lg shadow-lg p-6 w-80 hover:shadow-xl transition-shadow duration-300 ease-in-out"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Admin Dashboard"
        >
          <h2 className="text-xl text-[var(--dark-text)] font-semibold mb-2">
            Admin Dashboard
          </h2>
          <p className="mb-4  text-[var(--dark-secondary-text)] text-[14px]  ">
            Manage orders, products, categories, and customer information.
          </p>
          <Link
            to="/admin"
            className="bg-[var(--primary-light)] text-[var(--dark-text)] py-1.5 px-4 rounded-lg inline-block transition-colors duration-300 hover:bg-primary-dark"
            aria-label="Go to Admin Panel"
          >
            Go to Admin Panel
          </Link>
        </motion.div>

        <motion.div
          className="bg-secondary-color text-light-text rounded-lg shadow-lg p-6 w-80 hover:shadow-xl transition-shadow duration-300 ease-in-out"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Chef Dashboard"
        >
          <h2 className="text-xl text-[var(--dark-text)] font-semibold mb-2">Chef Dashboard</h2>
          <p className="mb-4 text-[var(--dark-secondary-text)] text-[14px] ">
            Track tickets, manage kitchen tasks, and update food status.
          </p>
          <Link
            to="/chef"
            className="bg-[var(--primary-light)] text-[var(--dark-text)] py-1.5 px-4 rounded-lg inline-block transition-colors duration-300 hover:bg-primary-dark"
            aria-label="Go to Chef Panel"
          >
            Go to Chef Panel
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
