# backend/utils/logger.py
# Standard logging util that should be used throughout the application.

import logging
import sys

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Set up logging to stdout
stdout_handler = logging.StreamHandler(sys.stdout)
stdout_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
stdout_handler.setFormatter(formatter)
logger.addHandler(stdout_handler)

# Create function to export and use in other modules
def get_logger():
    '''
    Returns the logger object
    Usage:
    from utils.logger import get_logger
    logger = get_logger()
    logger.info("Hello world!")
    '''
    return logger
