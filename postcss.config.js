module.exports = {
    syntax: "postcss-scss",
    plugins: [
        require("postcss-easy-import")({
            extensions: ".scss"
        }),
        require("autoprefixer")({
            cascade: false
        }),
        require("postcss-advanced-variables")({
            variables: require("./src/styles/variable")
        }),
        require("postcss-nested"),
        require("cssnano")()
    ]
};