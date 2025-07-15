import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconHome, 
  IconBuilding, 
  IconArrowLeft,
  IconSearch,
  IconMoodSad 
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.h1
              className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              404
            </motion.h1>
            
            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full opacity-60"
              animate={{ 
                y: [-10, 10, -10],
                x: [-5, 5, -5]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-6 w-6 h-6 bg-blue-400 rounded-full opacity-40"
              animate={{ 
                y: [10, -10, 10],
                x: [5, -5, 5]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 1, duration: 0.6 }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <IconMoodSad className="h-8 w-8 text-white" />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            The page you're looking for seems to have moved to a different property location. 
            Don't worry, we'll help you find your way back!
          </p>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <IconSearch className="h-5 w-5 mr-2 text-emerald-500" />
              What you can do:
            </h3>
            <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Check the URL for any typos</li>
              <li>• Browse our available properties</li>
              <li>• Use the navigation menu to explore</li>
              <li>• Contact our support team if you need help</li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >
            <Link to="/">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium px-6 py-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                <IconHome className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <Link to="/properties">
              <Button variant="outline" className="w-full sm:w-auto border-emerald-200 dark:border-gray-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-6 py-2">
                <IconBuilding className="h-4 w-4 mr-2" />
                Browse Properties
              </Button>
            </Link>
          </motion.div>      
        </motion.div>

        {/* Bottom Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
          >
            <IconBuilding className="h-5 w-5" />
            <span>Elite Properties</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
