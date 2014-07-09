# &lt;notification&gt; ![Bower Version](http://img.shields.io/badge/Bower%20package-0.1.0-green.svg)

> [Web Notifications API](http://www.w3.org/TR/notifications/) wrapper that allows you to do Notifications using [Polymer](http://www.polymer-project.org)


## Demo

[Check it live!](http://mateusortiz.github.io/notification-elements)

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install notification-elements --save
```

Or [download as ZIP](https://github.com/mateusortiz/notification-elements/archive/master.zip).

## Usage

1. Import Web Components' polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/mateusortiz/src/notification-elements.html">
    ```

3. Start using it!

    ```html
    <notification-elements></notification-elements>
    ```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`icon`         | *string*    | `icon.png`        | Specifies whether there is a icon in the notification.
`message`         | *string*    | `Hello World`        | Specifies your text notification
`duration`         | *int*    | `10`        | Specifies the time of notification

## Development

In order to run it locally you'll need to fetch some dependencies and a basic server setup.

* Install [Bower](http://bower.io/) & [Grunt](http://gruntjs.com/):

    ```sh
    $ [sudo] npm install -g bower grunt-cli
    ```

* Install local dependencies:

    ```sh
    $ bower install && npm install
    ```

* To test your project, start the development server and open `http://localhost:8000`.

    ```sh
    $ grunt connect
    ```

* To provide a live demo, send everything to `gh-pages` branch.

    ```sh
    $ grunt deploy
    ```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

For detailed changelog, check [Releases](https://github.com/mateusortiz/notification-elements/releases).

## License

[MIT License](http://opensource.org/licenses/MIT)
