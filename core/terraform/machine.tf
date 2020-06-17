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
      "mkdir logs-devices"
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


  provisioner "remote-exec" {
    inline = [
      "sudo apt-get --assume-yes update",
      "sudo apt --assume-yes install docker.io",
      "sudo systemctl start docker",
      "sudo systemctl enable docker",
      "sudo apt-get --assume-yes install android-tools-adb android-tools-fastboot"
    ]
  }

  provisioner "remote-exec" {
    inline = [
      "bash ./scripts/createAndroids.sh ${(var.number_devices)} ${(var.android_version)} ${(var.cpu_devices)} ${(var.ram_devices)}",
      "bash ./scripts/startAndroids.sh ${(var.number_devices)}",
      "bash ./scripts/installApk.sh ${(var.number_devices)} ${(var.time_wait)}",
      "bash ./scripts/executeApk.sh ${(var.number_devices)} ${(var.application_id)}"
    ]
  }

  provisioner "local-exec" {
    when    = destroy
    command = " ssh -o StrictHostKeyChecking=no -i ${(var.key_path)} ${(var.ec2_username)}@${(self.public_ip)} bash ./scripts/getLogs.sh ${(var.number_devices)} ${(var.application_id)} && scp -i ${(var.key_path)} -r ${(var.ec2_username)}@${(self.public_ip)}:logs-devices/ logs/ && node filterLogs.js ${(var.number_devices)}"
  }

  tags = {
    Name = var.project_name
  }
}