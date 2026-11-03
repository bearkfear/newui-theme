use std::collections::HashMap;
/// An owned entry with a borrowed key.
#[derive(Debug, Clone)]
struct Entry<'a> { key: &'a str, count: u32 }
trait Render { fn render(&self) -> String; }
impl<'a> Entry<'a> {
    fn new(key: &'a str) -> Self { Self { key, count: 42 } }
}
fn main() {
    let entry = Entry::new("Radix");
    let enabled = true && entry.count > 0;
    println!("{}: {}", entry.key, enabled);
}
