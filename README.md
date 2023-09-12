
# Perses

Perses framework for Distributed Mobile Applications Performance Analysis.

  

# Prerequisites

1. Download and install git -> https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

2. Download and install nodejs-> https://nodejs.org/en/download/

3. Download and install terraform -> https://www.terraform.io/downloads.html

4. Amazon Web Service (AWS) account -> https://aws.amazon.com/

5. [Verify the possibility of .metal instance creation](MetalVerification.md)

6. Obtain perses engine by sending an email to slasom (at) unex.es

7. Into perses engine folder:
- `npm install`

  

# Configure Test

Configure *test/credentialExample.yaml*

- AWS Access Key
- AWS Secret Key
- AWS Key '.pem' absolute path
- AWS Key name


Configure *test/configExample.yaml*
- Author
- Region (if necessary)
- Apk absolute path (the Apk test is in 'test' folder )
- Log tags
- Tests

  

# Usage

Usage: `node index -a action -g <config.yaml> -c <credentials.yaml> -n projectName`

**Where : action = setup | launch | tests | getLogs | destroy** 

### Setup project
` node index.js -a setup -g test/configExample.yaml -c test/credentialExample.yaml -n projectName `


### Launch project

`node index.js -a launch -n projectName`

### Run tests

`node index.js -a tests -n projectName`

### Get Logs

`node index.js -a getLogs -n projectName`
  
### Destroy project

`node index.js -a destroy -n projectName`

# Devops automation with GHA
Perses can be integrated with a devops cycle with the help of [GHA](https://github.com/features/actions)

## Prerequistes
 - Graddle configured to be run into the project (Having the script gradlew / graddle.bat [with execution rights configured propperly](https://stackoverflow.com/questions/17668265/gradlew-permission-denied) in the root of the repo)
 - APK build is configured to be generated at ``/app/build/outputs/apk/debug/app-debug.apk``
 - APK for Espresso tests build is configured to be generated at ``/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk``
 - Obtain PERSES_PAT access token  by sending an email to slasom (at) unex.es
 
## Configuration
1. Copy [GHA workflow](https://github.com/perses-org/gha/blob/master/workflow/perses.yml) into your repo ``.github/workflows/perses.yml`` 
2. Copy perses [configuration template](https://github.com/perses-org/gha/blob/master/template/.perses.yml) ``.perses.yml`` to the root of your repo and fill it in with your preferences.
3. Include the following secrets with your AWS credentials:
   - AWS_ACCESS_KEY
   - AWS_SECRET_KEY
   - KEY_NAME
   - KEY_PEM
   - PERSES_PAT

# Recommendations

### Time wait
**EC2 - C5.metal: (1.5 CPU and 3G RAM)**
- 3 min for 2 devices
- 3 min for 4 devices
- 4 min for 8 devices
- 6 min for 16 devices
- 9 min for 32 devices
- 18 min for 50 devices
- 25 min for 60 devices (max devices)

# Troubleshooting

## Permissions for terraform.pem are too open

If you encounter an error indicating that 'permissions for terraform.pem are too open,' please follow the appropriate steps to resolve it based on your operating system. These steps are also detailed in this [video](https://www.youtube.com/watch?v=mrUqITjUhL8&ab_channel=The_Sudo). 

### For Linux: 

1. Open your terminal. 
2. Navigate to the directory containing the terraform.pem file. 
3. Run the following command to modify the file permissions: 

```chmod 400 ./terraform.pem``` 

### For Windows: 

1. Locate the terraform.pem file in your file explorer. 
2. Right-click on the terraform.pem file and select "Properties." 
3. In the Properties window, navigate to the "Security" tab. 
4. Click on the "Advanced" button. 
5. In the Advanced Security Settings window, click on "Disable inheritance" and “Remove all inherited permissions from this object”. 
6. Click the "Add" button. 
7. In the "Select a Principal" window, type your system user's name and click "Check Names" to ensure it's recognized. 
8. Click "OK" to confirm. 
9. In the permissions window, make sure to grant only "Read" and "Read & Execute" permissions. 
10. Click "OK" to save the changes. 
11. Back in the Properties window, click "Apply," and then click "OK" to confirm the changes. 

Your terraform.pem file should now have the appropriate permissions configured. 
