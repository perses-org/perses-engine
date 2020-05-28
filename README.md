# Perses
Perses framework for Mobile Application Performance  Analysis

# Requisites

Download and install git -> https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

Download and install nodejs-> https://nodejs.org/en/download/

Download and install terraform -> https://www.terraform.io/downloads.html

    git clone https://github.com/perses-org/perses.git

Into perses project

    npm install


# Usage

Usage: node index -a action -g <config.yaml> -c <credentials.yaml> -n projectName

    Where : action = setup | launch | destroy 

### Setup project

    -a setup -g tests/assets/configExample.yaml -c tests/assets/credentialsExample.yaml -n projectName

Copy apk from tests\assets\app-debub.apk to project folder projects/projectName/apk/

### Launch project
    -a launch projectName

### Destroy project
    -a destroy projectName