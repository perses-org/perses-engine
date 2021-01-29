## Verification of .metal instance creation

Perses  requires  AWS ``.metal``instances that allow nested virtualization, however Ahese correspond with large instances and AWS usually define a maximum threshold by default to
the number of vCPUs (typically 32 vCPU) the usuer could request and therefore ```.metal``` (starting at 96 CPU) are disabled in the default configuration.

As a consequence, the user should require to enable them to AWS by increasing the vCPUs limit to at, least, 96 using the AWS form
in http://aws.amazon.com/contact-us/ec2-request and specifying an appropriate *Use case description*, as an example:
 
        We need the increase to use at least "C5.metal" instances (with 96 vCPUs) to 
        apply the Perses Framework for Distributed Application Performance Testing. 
        This framework require ".metal" instances that allow nested virtualization 
        in order to generate virtual android devices that conform the testing scenario.
 
