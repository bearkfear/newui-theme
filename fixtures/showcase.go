package main

import "fmt"
// User keeps names readable.
type User struct { Name string; Active bool }
func greet(user User) string {
    count := 42
    if user.Active && count > 0 { return "Hello, " + user.Name }
    return "Guest"
}
func main() { fmt.Println(greet(User{Name: "Radix", Active: true})) }
