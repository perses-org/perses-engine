provider "aws" {
  region = "{{region}}"
}

resource "aws_instance" "web" {
  ami                    = "ami-25488752"
  instance_type          = "{{instance_type}}"
  vpc_security_group_ids = ["${aws_security_group.web.id}"]
  user_data              = "${file("template/user_data.sh")}"

  tags {
    Name = "{{testId}}"
  }
}

resource "aws_security_group" "web" {
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}