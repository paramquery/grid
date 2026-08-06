# ParamQuery Grid (Community Edition)

[ParamQuery Grid](http://paramquery.com) is a lightweight and powerful JavaScript grid plugin that works seamlessly with **Angular, React, Vue, jQuery, Knockout, and plain JavaScript**.

Copyright © 2012–2026 Paramvir Dhindsa  
[Released under GPL v3 license](http://paramquery.com/license)

---

## 📚 Documentation & Resources

1. [Tutorial](http://paramquery.com/tutorial)  
2. [API Reference](http://paramquery.com/api)  
3. [Demos & Examples](http://paramquery.com/demos)  
4. [PHP Integration Tutorial](http://paramquery.com/tutorial/php)  

---

## ✨ Features

- Supports **100,000+ records** efficiently  
- Works with **Angular, React, Vue, Knockout, jQuery, plain JS**  
- Excel-like features: **copy-paste, autofill, drag-to-fill**  
- **State management** with undo/redo history  
- Local, remote, and custom **sorting** for numbers, strings, dates  
- Local & remote **filtering** with header filter row  
- **Paging** with local or remote data sources  
- **Column & row grouping** with fixed summary rows  
- **Frozen rows & columns** (Excel-style)  
- Export to **Excel (xlsx), HTML, JSON, CSV**  
- **Nested grids** and row details  
- **Virtual scrolling & rendering** for unlimited rows/columns  
- Rich **inline editing**: batch, row, custom editors, multiline, validations  
- Column operations: **hide/show, resize, reorder (drag & drop)**  
- **Theme support** and **i18n**  
- Cross-browser compatibility: IE11, Edge, Firefox, Chrome, Opera  
- Supports multiple data sources: **HTML, Array, XML, JSON**  
- Compatible with server-side frameworks: **ASP.NET, MVC, JSP, JSF, PHP**  
- And much more...

---

## 🚀 Getting Started

### Installation

You can include ParamQuery Grid via CDN, by downloading the package or via npm.

```
npm i pqgridf
```

### Basic Usage

```html
<div id="grid"></div>

<script>
  $(function () {
    var data = [
      { name: "John", age: 28, city: "New York" },
      { name: "Alice", age: 32, city: "London" },
      { name: "Bob", age: 25, city: "Paris" }
    ];

    $("#grid").pqGrid({
      width: "100%",
      height: 400,
      colModel: [
        { title: "Name", dataIndx: "name", width: 150 },
        { title: "Age", dataIndx: "age", width: 100 },
        { title: "City", dataIndx: "city", width: 150 }
      ],
      dataModel: { data: data }
    });
  });
</script>
```

---

### Framework Integration

- **jQuery**
- **Angular**  
- **React**  
- **Vue**  
- **Knockout**

---

## 📦 Contributing

Contributions are welcome! Please fork the repository, make changes, and submit a pull request.  

---

## 📜 License

This project is licensed under the [GPL v3 License](http://paramquery.com/license).
