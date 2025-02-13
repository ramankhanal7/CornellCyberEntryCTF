# Cornell Cyber Web Exploitation CTF Officer Writeup

## **CTF Challenge and Writeup Author/Creator**
Raman Khanal - Cornell '27

## **Introduction**

This writeup explains how each level should be solved and highlights the security vulnerabilities present in the Cornell Cybersecurity Club 2025 Spring Web Exploitation CTF challenge developed by me to test the basic CTF and cybersecurity skills of our new applicants.

Link: `https://cornellcyberentryctf.onrender.com/`

---

## **Level 1: Exploiting Default Credentials**

### **Challenge Description**

The first page presents a basic login form with the following hint:

> "The most secure credentials are often the simplest. 😏"
> 

This suggests that the credentials are super weak, likely using a default username and password.

### **Exploitation**

Many web applications ship with default credentials and a common vulnerability in something like a router gateway is the default login because normal people forget to change these or have no idea that this vulnerability exists. This challenge is aimed at whether the student has the most basic cybersecurity knowledge. 

The most common default username and passwords are:

- **Username:** `admin`
- **Password:** `password`

Entering these credentials successfully logs us into Level 2.

---

## **Level 2: Client-Side Code Inspection**

### **Challenge Description: Client-Side Security Flaw**

The second login page is similar to Level 1 but slightly more complex. The following hint has been  provided:

> "Real hackers inspect client-side code. Maybe the function below has the answer?"
> 

The HTML source code contains a JavaScript function:

```
function revealPassword() {
    fetch('/get-password')
        .then(response => response.json())
        .then(data => {
            console.log("Hint: The password is: " + data.password);
        })
        .catch(err => {
            console.error("Error fetching the password:", err);
        });
}
```

### **Exploitation**

- The function `revealPassword()` fetches the password from the `/get-password` endpoint in our backend and logs it to the **browser console**. (This is a very insecure way of handling things in real applications so hopefully it is obvious enough.)
- Executing `revealPassword()` in the browser’s **Developer Tools Console**
    
    ```
    Hint: The password is: notbadhuh?
    ```
    
- Using `admin` as the username and `notbadhuh?` as the password successfully logs the student onto Level 3.

---

## **Level 3: Arbitrary PHP Code Execution**

### **Challenge Description**

The final challenge requires crafting a valid **PHP script** to extract a hidden flag. The hint given here is:

> "The PHP code must start and end correctly. It should also have a specific line since there is really just one way to solve this."
> 

There is a hint at the top of the page as the title of the web page that reads `FLAG`

### **Exploitation**

Since the backend has an issue where the flag is hardcoded and accessible through PHP code execution, the hint above combined with all the other hints on the page are supposed to allow the student to know that they should `echo $FLAG` for the flag.

The input form allows users to submit **PHP code**. Since PHP executes on the server, we can attempt to print any predefined server-side variables.

Crafting and submitting the following PHP code:

```
<?php
	echo $FLAG;
?>
```

reveals the flag: `flag{Cornell_File_Upload_Pwn}`
