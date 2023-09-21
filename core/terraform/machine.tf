resource "aws_instance" "virtual_environment_perses" {

  ami                         = var.ami_id
  instance_type               = var.instance_type
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.virtual_environment_perses.id]
  key_name                    = var.key_name


  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = var.ec2_username
    private_key = file(var.key_path)
    timeout     = "60m"
  }

  root_block_device {
    volume_size = var.volume 
  }

  provisioner "remote-exec" {
    inline = [
      "mkdir apk",
      "mkdir scripts",
      "mkdir devices-logs",
      "mkdir devices-logs/espresso"
    ]
  }

  provisioner "file" {
    source      = "./scripts/"
    destination = "./scripts/"
  }

  provisioner "file" {
    source      = var.apk_path
    destination = "./apk/app.apk"
  }

  provisioner "file" {
    source      = var.apk_test_path
    destination = "./apk/app_test.apk"
    on_failure = continue
  }

  provisioner "remote-exec" {
    inline = [
      "bash ./scripts/connection.sh ${(var.key_path)} ${(var.ec2_username)} ${(self.public_ip)} ${(var.number_devices)} ${(var.application_id)}"]
  }

  provisioner "local-exec" {
    command = "scp -o StrictHostKeyChecking=no -i ${(var.key_path)} ${(var.ec2_username)}@${(self.public_ip)}:connection.txt connection.txt"
    
  }



  provisioner "remote-exec" {
    inline = [
      "sudo apt-get --assume-yes update",
      "sudo apt --assume-yes install docker.io",
      "sudo systemctl start docker",
      "sudo systemctl enable docker",
      "sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 21805A48E6CBBA6B991ABE76646193862B759810",
	    "sudo add-apt-repository ppa:katharaframework/kathara -y",
	    "sudo apt --assume-yes update",
	    "sudo apt --assume-yes install kathara",
      "sudo apt --assume-yes install xterm",
      "sudo apt-get --assume-yes install android-tools-adb android-tools-fastboot",
      "sudo apt  --assume-yes install curl",
      "curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -",
      "sudo apt --assume-yes install nodejs",
      "cd scripts",
      "npm install"
    ]
  }



    provisioner "remote-exec" {
    inline = [
      "bash ./scripts/createNetwork.sh ${(var.number_devices)}",
      "node ./scripts/configNetwork.js ",
      "bash ./scripts/configDevices.sh ${(var.number_devices)} ${(var.delay)}",
      "sudo cp -r apk lab/shared/",
      "sudo docker system prune -f",
      "sudo systemctl stop docker",
      "sudo dockerd -H tcp://0.0.0.0:2375",
      "sudo bash ./scripts/startVE.sh",
      "bash ./scripts/installApk.sh ${(var.number_devices)} ${(var.time_wait)}",
      "bash ./scripts/executeApk.sh ${(var.number_devices)} ${(var.application_id)}"
    ]
  }

  tags = {
    Name = var.project_name
  }
}
