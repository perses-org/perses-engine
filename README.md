# perses
Perses framework for Mobile Application Performance  Analysis


## Usage
```
Usage: index <config.yaml> <credentials.yaml> <testId>
```
Example:
```
node index tests/assets/configExample.yaml tests/assets/credentialsExample.yaml myTest


```


# (future) Usage
```
Usage: index -a <action> -g <config.yaml> -c <credentials.yaml> -i <testId>

    Where : action = setup | launch | results | destroy 

-a setup tests/assets/configExample.yaml tests/assets/credentialsExample.yaml myTest
-a launch myTest
-a results myTest
-a destroy myTest