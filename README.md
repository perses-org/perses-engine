# Perses
Perses framework for Mobile Application Performance  Analysis

# Requisites

Download and install terraform -> https://www.terraform.io/downloads.html

git clone https://github.com/perses-org/perses.git
Into perses, execute 'npm install' to install packages.


# Usage

Usage: node index -a action -g <config.yaml> -c <credentials.yaml> -n projectName

    Where : action = setup | launch | destroy 

-a setup -g tests/assets/configExample.yaml -c tests/assets/credentialsExample.yaml -n projectName

-a launch projectName

-a destroy projectName