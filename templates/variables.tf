variable "project_name"{
  description = "Project Name"
  type        = string
  default     = "{{project_name}}"

}


variable "access_key" {
  description = "AWS access key"
  type        = string
  default     = "{{access_key}}"
}


variable "secret_key" {
  description = "AWS secret key"
  type        = string
  default     = "{{{secret_key}}}"
}


variable "region"{
  description = "AWS Region"
  type        = string
  default     = "{{region}}"
}


variable "author" {
  description = "Name of the operator. Used as a prefix to avoid name collision on resources."
  type        = string
  default     = "{{author}}"
}


variable "key_path" {
  description = "Key path for SSHing into EC2"
  type        = string
  default     = "{{{key_path}}}"
}


variable "key_name" {
  description = "Key name for SSHing into EC2"
  type        = string
  default     = "{{key_name}}"
}


variable "ec2_username" {
  description = "User name to log in to EC2"
  type        = string
  default     = "{{ec2_username}}"
}

variable "instance_type"{
  description = "Instance AWS type"
  type        = string
  default     = "{{instance_type}}"
}


variable "ami_id"{
  description = "AWS AMI_ID"
  type        = string
  default     = "{{ami_id}}"
}


variable "volume" {
  description = "Volume size in GB."
  type        = string
  default     = "{{volume_size}}"
}


variable "number_devices"{
  description = "Numbers of Android devices to deploy."
  type        = string
  default     = "{{number_devices}}"
}


variable "cpu_devices"{
  description = "Maximum CPU for each Android devices (minimum 1.5)."
  type        = string
  default     = "{{cpu_devices}}"
}


variable "ram_devices"{
  description = "Maximum RAM for Android devices (minimum 3g)."
  type        = string
  default     = "{{ram_devices}}"
}


variable "android_version"{
  description = "Android version to use (6 to 10)."
  type        = string
  default     = "{{android_version}}"
}


variable "application_id"{
  description = "Application Id (app.package.name) of Android app."
  type        = string
  default     = "{{application_id}}"
}


variable "time_wait"{
  description = "Time to wait for the deployment of Android devices (1m - 1 minute, 1h - 1 hour)"
  type        = string
  default     = "{{time_wait}}"
}