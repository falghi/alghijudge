workflow "CD" {
  on = "push"
  resolves = ["Run deploy script"]
}

action "Run deploy script" {
  uses = "maddox/actions/ssh@master"
  args = "cd /home/falghifa/judge.falghifari.com/ && git pull"
  secrets = [
    "PRIVATE_KEY",
    "HOST",
    "USER",
    "PORT"
  ]
}
