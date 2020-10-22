
# Perses

Perses framework for Mobile Application Performance Analysis

  

# Requisites

1. Download and install git -> https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

2. Download and install nodejs-> https://nodejs.org/en/download/

3. Download and install terraform -> https://www.terraform.io/downloads.html

4. `git clone https://github.com/perses-org/perses.git`

5. Into perses project:
- `npm install`

  

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

Usage: `node index -a action -g <config.yaml> -c <credentials.yaml> -n projectName`

**Where : action = setup | launch | tests | destroy** 

### Setup project
` node index.js -a setup -g test/configExample.yaml -c test/credentialsExample.yaml -n projectName `

  

### Launch project

`node index.js -a launch -n projectName`

### Run tests

`node index.js -a tests -n projectName`

  
### Destroy project

`node index.js -a destroy -n projectName`

   

# Recommendations

### Time wait
**EC2 -- C5.metal: (1.5 CPU and 3G RAM)**
- 2 min for 2 devices
- 2 min for 4 devices
- 3 min for 8 devices
- 5 min for 16 devices
- 8 min for 32 devices
- 15 min for 50 devices
- 23 min for 60 devices (max devices)