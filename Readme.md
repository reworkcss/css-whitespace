
# css-whitespace

  Whitespace significant CSS to regular CSS.

## Example

```css

@charset "utf-8"

@import "foo.css"

body
  padding: 50px
  background: black
  colour: white

button
  border-radius: 5px
  padding: 5px 10px

@media print
  body
    padding: 0

  button
    border-radius: 0
    width: 100%
```

yields:

```css
@charset "utf-8";

@import "foo.css";

body {
  padding: 50px;
  background: black;
  colour: white;
}

button {
  border-radius: 5px;
  padding: 5px 10px;
}

@media print {
  body {
    padding: 0;
  }
  button {
    border-radius: 0;
    width: 100%;
  }
}
```

## License 

  MIT
