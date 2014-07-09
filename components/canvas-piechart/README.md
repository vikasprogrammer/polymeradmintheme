# &lt;canvas-piechart&gt;

> A web-component to draw a piechart using Polymer and HTML5 Canvas.

## Demo
> [Check it live](http://timeu.github.io/canvas-piechart/components/canvas-piechart/demo.html).

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install canvas-piechart --save
```

Or [download as ZIP](https://github.com/timeu/canvas-piechart/archive/master.zip).

## Usage

1. Import Web Components' polyfill:

  ```html
<script src="bower_components/platform/platform.js"></script>
  ```

2. Import Custom Element:

  ```html
<link rel="import" href="bower_components/canvas-piechart/canvas-piechart.html">
  ```

3. Start using it!

  ```html
  <canvas-piechart size="250" data="[10,20,50,20]"></canvas-piechart>
  

## Options

See the [component page](http://timeu.github.io/canvas-piechart) for more information.

Attribute | Options         | Default                    | Description
---       | ---             | ---                        | ---
`size` | number | 50 | The size of the piechart in pixel. 
`data`    | array[number]    | null | The values for each slice.
`colors`   | array[string]           | ColorBrewer Colors                  | Specifies the colors to be used for each slice of the piechart. 


## Browser Support

![IE](https://raw.github.com/paulirish/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Chrome](https://raw.github.com/paulirish/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/paulirish/browser-logos/master/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/paulirish/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/paulirish/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
IE 10+ ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

Check [Release](https://github.com/timeu/google-map-markerclusterer/releases) list.

## License

[MIT License](http://timeu.mit-license.org/) © Ümit Seren
