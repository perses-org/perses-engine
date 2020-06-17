# Perses
Perses framework for Mobile Application Performance  Analysis

# Requisites

Download and install git -> https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

Download and install nodejs-> https://nodejs.org/en/download/

Download and install terraform -> https://www.terraform.io/downloads.html

    git clone https://github.com/perses-org/perses.git

Into perses project

    npm install

# Configure Test

Configure *test/credentialExample.yaml*
- Access Key
- Secret Key
- Key '.pem' absolute path
- Key name

Configure *test/configExample.yaml*
- Author
- Region (if necessary)
- Apk absolute path (the Apk test is in 'test' folder )
- Log tags
- Tests

# Usage

Usage: node index -a action -g <config.yaml> -c <credentials.yaml> -n projectName

    Where : action = setup | launch | tests | destroy 

### Setup project

    -a setup -g test/configExample.yaml -c test/credentialsExample.yaml -n projectName

### Launch project
    -a launch -n projectName

### Run tests
    -a tests -n projectName

### Destroy project
    -a destroy -n projectName