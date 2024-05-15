// global variable to passing all values from `tenoxui`
let allProps, Classes, AllClasses;
// TenoxUI make style class
class makeTenoxUI {
    // TenoxUI constructor
    constructor(element, styledProps) {
        // basically selector
        this.element = element;
        // all types and properties
        this.styles = styledProps || {};
    }
    // `applyStyle`: Handle the styling and custom value for property
    applyStyle(type, value, unit) {
        // the styles with let, not constant, because the properties no longer using array, optionally it can just be string
        let properties = this.styles[type];
        // If properties matched the `type` or `property` from `allProperty`
        if (properties) {
            // If properties has only one css property and it was string, not wrapped inside an array
            if (!Array.isArray(properties)) {
                // Convert the string value from property into an array
                properties = [properties];
            }
            properties.forEach((property) => {
                // filter
                if (property === "ftr") {
                    this.element.style.filter = `${type}(${value}${unit})`;
                }
                // backdrop filter styles handler
                else if (property === "bFt") {
                    //? backdrop-filter function shorthand
                    const filters = [
                        "blur",
                        "sepia",
                        "saturate",
                        "grayscale",
                        "brightness",
                        "invert",
                        "contrast"
                    ];
                    const backdropFunctions = {};
                    filters.forEach(filter => {
                        backdropFunctions[`back-${filter}`] = filter;
                    });
                    const backdropFunction = backdropFunctions[type];
                    if (backdropFunction) {
                        this.element.style.backdropFilter = `${backdropFunction}(${value}${unit})`;
                    }
                }
                // Transform single value
                else if (property === "tra") {
                    const transformFunctions = {
                        translate: "translate",
                        "move-x": "translateX",
                        "move-y": "translateY",
                        matrix: "matrix",
                        "matrix-3d": "matrix3d",
                        "scale-3d": "scale3d",
                        "scale-x": "scaleX",
                        "scale-y": "scaleY",
                        "skew-x": "skewX",
                        "skew-y": "skewY"
                    };
                    const transformFunction = transformFunctions[type];
                    if (transformFunction) {
                        this.element.style.transform = `${transformFunction}(${value}${unit})`;
                    }
                }
                /*
                 * CSS Variable Support 🎋
                 *
                 * Check className if the `value` is started with `$`,
                 * if so then this is treated as css variable, css value.
                 */
                // Check if the value is a CSS variable
                else if (value.startsWith("$")) {
                    // remove the "$" prefix
                    const cssValue = value.slice(1);
                    this.element.style[property] = `var(--${cssValue})`;
                }
                /*
                 * Custom values support 🪐
                 *
                 * Check className if the `value` is wrapped with square bracket `[]`,
                 * if so then this is treated as custom value and ignore default value.
                 */
                // Check if the value is a CSS variable enclosed in square bracket `[]`
                else if (value.startsWith("[") && value.endsWith("]")) {
                    const values = value.slice(1, -1).replace(/\\_/g, " ");
                    // if value start with `--`, treat value as css variable
                    if (values.startsWith("--")) {
                        this.element.style[property] = `var(${values})`;
                    }
                    // else, will use custom `value`
                    else {
                        this.element.style[property] = values;
                    }
                }
                else {
                    /*
                     * Default value handler 🎏
                     * All types will have this as default values, no additional value
                     */
                    this.element.style[property] = `${value}${unit}`;
                }
            });
        }
        // console.log(this.styles);
    }
    // Handle all possible values
    applyStyles(className) {
        // Using RegExp to handle the value
        const match = className.match(/(-?[a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\{[^\}]+\})|(?:\$[^\s]+))([a-zA-Z%]*)/);
        if (match) {
            // type = property class. Example: p-, m-, flex-, fx-, filter-, etc.
            const type = match[1];
            // value = possible value. Example: 10, red, blue, etc.
            const value = match[2];
            // unit = possible unit. Example: px, rem, em, s, %, etc.
            const unitOrValue = match[4];
            // Combine all to one class. Example 'p-10px', 'flex-100px', 'grid-row-6', etc.
            this.applyStyle(type, value, unitOrValue);
        }
    }
    // Multi styler function, style through javascript.
    applyMultiStyles(styles) {
        // Splitting the styles
        const styleArray = styles.split(/\s+/);
        // Applying the styles using forEach and `applyStyles`
        styleArray.forEach((style) => {
            this.applyStyles(style);
        });
    }
}
// Applied multi style into all elements with the specified element, possible to all selector
function makeStyle(selector, styles) {
    const applyStylesToElement = (element, styles) => {
        const styler = new makeTenoxUI(element, allProps);
        styler.applyMultiStyles(styles);
    };
    if (typeof styles === "string") {
        // If styles is a string, apply it to the specified selector
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => applyStylesToElement(element, styles));
    }
    else if (typeof styles === "object") {
        // If styles is an object, iterate through its key-value pairs
        Object.entries(styles).forEach(([classSelector, classStyles]) => {
            const elements = document.querySelectorAll(classSelector);
            elements.forEach((element) => applyStylesToElement(element, classStyles));
        });
    }
    // Error Handling for makeStyle
    else {
        console.warn(`Invalid styles format for "${selector}". Make sure you provide style correctly`);
    }
}
function makeStyles(...stylesObjects) {
    // Store defined styles into an object
    const definedStyles = {};
    // Helper function to apply styles into elements
    const applyStylesToElement = (element, styles) => {
        // Define new styler
        const styler = new makeTenoxUI(element, allProps);
        // If the styles is a string, like: "p-20px m-1rem fs-2rem" / Stacked classes
        if (typeof styles === "string") {
            // Handled using `applyMultiStyles`
            styler.applyMultiStyles(styles);
        }
        else {
            // Handle nested styles / if the value is new object
            Object.entries(styles).forEach(([prop, value]) => {
                styler.applyStyle(prop, value, "");
            });
        }
    };
    // Recursive function to handle nested styles
    const applyNestedStyles = (parentSelector, styles) => {
        // Handle nested style
        Object.entries(styles).forEach(([childSelector, childStyles]) => {
            const elements = document.querySelectorAll(`${parentSelector} ${childSelector}`);
            // Apply nested styles if the value is an object / new object as value
            if (typeof childStyles === "object" && !Array.isArray(childStyles)) {
                applyNestedStyles(`${parentSelector} ${childSelector}`, childStyles);
            }
            // Apply direct styles if not overridden by nested styles / default style
            else {
                // Default handler if style is a string / default styler (e.g. "p-1rem fs-1rem")
                elements.forEach(element => {
                    if (typeof childStyles === "string" ||
                        (typeof childStyles === "object" && !Array.isArray(childStyles))) {
                        applyStylesToElement(element, childStyles);
                    }
                    else {
                        console.warn("Invalid nested style for :", childStyles);
                    }
                });
            }
        });
    };
    // Handle styling logic, nested style or only default
    stylesObjects.forEach(stylesObject => {
        Object.entries(stylesObject).forEach(([selector, styles]) => {
            // If the styles is an object or nested style, use `applyNestedStyles` function to apply nested style logic
            if (typeof styles === "object" && !Array.isArray(styles)) {
                applyNestedStyles(selector, styles);
            }
            // If the styles is not overridden by nested style, apply styles using default styler
            else {
                // Stacking selector and
                const elements = document.querySelectorAll(selector);
                // Apply direct styles into element using default styler
                elements.forEach(element => {
                    if (typeof styles === "string" ||
                        (typeof styles === "object" && !Array.isArray(styles))) {
                        applyStylesToElement(element, styles);
                    }
                    else {
                        console.warn("Invalid styles type:", styles);
                    }
                });
            }
            // Store defined styles for reuse
            definedStyles[selector] = styles;
        });
    });
    // returning defined styles
    return definedStyles;
}
// hover handler test function (update v0.7)
// applyHovers function
function applyHovers(hovers) {
    Object.entries(hovers).forEach(([selector, [notHover, isHover, styles = ""]]) => {
        // selector
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            // makeTenoxUI instance
            const styler = new makeTenoxUI(element, allProps);
            // applying default styles
            // styler.applyMultiStyles(`${notHover} ${styles}`);
            styler.applyMultiStyles(styles);
            // when the element is hovered
            element.addEventListener("mouseenter", () => {
                // apply hover style
                styler.applyMultiStyles(isHover);
            });
            // default style / when element not hovered
            element.addEventListener("mouseleave", () => {
                // apply default style
                styler.applyMultiStyles(notHover);
            });
        });
    });
}
// `use` function, defining types and properties
function use(...customPropsArray) {
    // Check if customPropsArray is provided and not empty
    if (!customPropsArray.some(props => Object.keys(props).length !== 0)) {
        console.warn("`use` function must have at least one type and property!");
        return;
    }
    // merging styles
    let styles = Object.assign({}, ...customPropsArray);
    // Assign merged styles to allProps
    allProps = styles;
    // Generate className from property key name, or property type
    Classes = Object.keys(styles).map(className => `[class*="${className}-"]`);
    AllClasses = document.querySelectorAll(Classes.join(", "));
    // Iterate over elements with AllClasses
}
// Applying the style to all elements ✨
function tenoxui(...customPropsArray) {
    // Check if customPropsArray is provided and not empty
    //   if (!customPropsArray.some(props => Object.keys(props).length !== 0)) {
    //     console.warn("tenoxui function must have at least one type and property!");
    //     return;
    //   }
    if (allProps === undefined) {
        throw Error("Have at least one type and property!");
        return;
    }
    // Merge customPropsArray with allProps if it exists, otherwise create a new merged object
    let styles = Object.assign({}, allProps, ...customPropsArray);
    // passing for global values
    allProps = styles;
    // Generate className from property key name, or property type
    Classes = Object.keys(allProps).map(className => `[class*="${className}-"]`);
    // Classes = Object.keys(property).map((className) => `[class*="${className}-"]`);
    AllClasses = document.querySelectorAll(Classes.join(", "));
    // Iterate over elements with AllClasses
    AllClasses.forEach((element) => {
        // Get the list of classes for the current element
        const htmlELement = element;
        const classes = htmlELement.classList;
        // Make TenoxUI
        const styler = new makeTenoxUI(htmlELement, allProps);
        // Iterate over classes and apply styles using makeTenoxUI
        classes.forEach(className => {
            styler.applyStyles(className);
        });
    });
}
export { allProps, makeStyle, makeStyles, applyHovers, makeTenoxUI, use, tenoxui as default };
//# sourceMappingURL=tenoxui.esm.js.map