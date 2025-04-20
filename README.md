# Tex Passwd

A nodejs multipurpose password generator that adapts to different contexts.

## Installation

```bash
git clone git@github.com:muriloat/tex-passwd.git
cd tex-passwd
npm install
sudo npm install -g .
```

## Usage

```bash
Usage: tex-passwd [options]

A secure password generator with various options for different purposes

Options:
  -V, --version          output the version number
  -l, --length <number>  password length (default: 16)
  -p, --purpose <type>   password purpose: general, database, shell, url, xml, json, windows (default: "general")
  -e, --exclude <chars>  custom characters to exclude
  --no-lowercase         exclude lowercase letters
  --no-uppercase         exclude uppercase letters
  --no-numbers           exclude numbers
  --no-special           exclude special characters
  -c, --count <number>   number of passwords to generate (default: 1)
  -h, --help             display help for command
```

## Examples

```bash
# Specific length
tex-passwd -l 5
9?eN0QQp
# No inappropriate shell characters
tex-passwd -l 10 -p shell
Vv0&3++.HG
# No numbers
tex-passwd -l 10 -p shell --no-numbers
KFkHuMn-@t
# No special characters
-passwd -l 10 -p shell --no-special
r4qQugZquc
# Batch generation
tex-passwd -l 10 -p shell --no-special -c 4
GNOOZ1D3Hi
VPmDtu9u48
gWWdmYc9a1
5Mcs0PfJkC

Generated 4 passwords for purpose: shell
Length: 10 characters
```
