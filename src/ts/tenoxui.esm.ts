/*!
 * TenoxUI CSS Framework v0.6.0 [ https://tenoxui.web.app ]
 * copyright (c) 2024 nousantx
 * licensed under MIT [ https://github.com/nousantx/tenoxui/blob/main/LICENSE ]
 */

// Importing All property that will be used on TenoxUI
import property from "./lib/property.js";

let Classes: String[], AllClasses: NodeListOf<HTMLElement>;

// Check browser environment
if (typeof window !== "undefined") {
  // Make classes from type name from properties key name
  Classes = Object.keys(property).map(
    (className) => `[class*="${className}-"]`
  );

  // Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
  AllClasses = document.querySelectorAll(Classes.join(", "));
}

// Props maker function :)
function newProp(name: string, values: string[]): void {
  // Error handling, the type must be a string, properties must be an array
  if (typeof name !== "string" || !Array.isArray(values)) {
    console.warn(
      "Invalid arguments for newProp. Please provide a string for keys and array for values."
    );
    return;
  }

  this[name] = values;

  if (typeof window !== "undefined") {
    // Combine the type and property to allProperty after defined it to Classes and AllClasses
    Classes.push(`[class*="${name}-"]`);
    AllClasses = document.querySelectorAll(Classes.join(", "));
  }
}

// Function to handle add `type` and `property`
newProp.prototype.tryAdd = function (): void {
  if (!this || Object.keys(this).length === 0) {
    console.warn("Invalid newProp instance:", this);
    return;
  }

  // Added new `type` and `property` to the All Property
  Object.assign(property, this);
};

// Add new `type` and `property`
function addType(Types: string, Property: string[]): void {
  // Check if 'Types' is a string
  if (typeof Types !== "string") {
    throw new Error("Types must be a string");
  }

  // Check if 'Property' is a string or an array
  if (!Array.isArray(Property) && typeof Property !== "string") {
    throw new Error("Property must be a string or array");
  }

  // If properties has only one css property and it was string, not wrapped inside an array
  if (typeof Property === "string") {
    // Convert the string value from property into an array
    Property = [Property];
  }

  // Add new property
  new newProp(Types, Property).tryAdd();
}

// makeTenoxUI class
class makeTenoxUI {
  element: HTMLElement;
  styles: any;

  // TenoxUI constructor
  constructor(element: HTMLElement) {
    this.element = element;
    this.styles = property;
  }

  // `applyStyle`: Handle the styling and custom value for property
  applyStyle(type: string, value: string, unit: string): void {
    // the styles with let, not constant, because the properties no longer using array, optionally it can just be string
    let properties = this.styles[type];
    // If properties matched the `type` or `property` from `allProperty`
    if (properties) {
      // If properties has only one css property and it was string, not wrapped inside an array
      if (!Array.isArray(properties)) {
        // Convert the string value from property into an array
        properties = [properties];
      }

      properties.forEach((property: string) => {
        // Filter Custom Property
        if (property === "filter") {
          const existingFilter = this.element.style[property];
          this.element.style[property] = existingFilter
            ? `${existingFilter} ${type}(${value}${unit})`
            : `${type}(${value}${unit})`;
        }
        // Make custom property for flex
        else if (type === "flex-auto") {
          this.element.style[property] = `1 1 ${value}${unit}`;
        } else if (type === "initial-flex") {
          this.element.style[property] = `0 1 ${value}${unit}`;
        }
        // Grid System Property [ Not Stable... Yet :) ]
        else if (
          property === "gridRow" ||
          property === "gridColumn" ||
          property === "gridRowStart" ||
          property === "gridColumnStart" ||
          property === "gridRowEnd" ||
          property === "gridColumnEnd"
        ) {
          this.element.style[property] = `span ${value}${unit}`;
        } else if (type === "grid-row" || type === "grid-col") {
          this.element.style[property] = `repeat(${value}${unit}, 1fr)`;
        } else if (type === "auto-grid-row" || type === "auto-grid-col") {
          this.element.style[
            property
          ] = `repeat(auto-fit, minmax(${value}${unit}, 1fr))`;
        }
        // Backdrop Filter Property
        else if (property === "backdropFilter") {
          // Check if there's an existing backdrop-filter value
          const backdropContainer = this.element.style[property];
          // Handle different backdrop-filter properties
          switch (type) {
            case "back-blur":
              this.element.style[property] = `${
                backdropContainer || ""
              } blur(${value}${unit})`;
              break;
            case "back-sepia":
              this.element.style[property] = `${
                backdropContainer || ""
              } sepia(${value}${unit})`;
              break;
            case "back-saturate":
              this.element.style[property] = `${
                backdropContainer || ""
              } saturate(${value}${unit})`;
              break;
            case "back-grayscale":
              this.element.style[property] = `${
                backdropContainer || ""
              } grayscale(${value}${unit})`;
              break;
            case "back-brightness":
              this.element.style[property] = `${
                backdropContainer || ""
              } brightness(${value}${unit})`;
              break;
            case "back-invert":
              this.element.style[property] = `${
                backdropContainer || ""
              } invert(${value}${unit})`;
              break;
            case "back-contrast":
              this.element.style[property] = `${
                backdropContainer || ""
              } contrast(${value}${unit})`;
              break;
            default:
              break;
          }
        }
        // Transform Property
        else if (property === "transform") {
          // Check if there any transform property and class on the element
          const transformContainer = this.element.style[property];
          // Handle different transform properties
          switch (type) {
            case "translate":
              this.element.style[property] = `${
                transformContainer || ""
              } translate(${value}${unit})`;
              break;
            case "rt":
              this.element.style[property] = `${
                transformContainer || ""
              } rotate(${value}${unit})`;
              break;
            case "rotate":
              this.element.style[property] = `${
                transformContainer || ""
              } rotate(${value}${unit})`;
              break;
            case "move-x":
              this.element.style[property] = `${
                transformContainer || ""
              } translateX(${value}${unit})`;
              break;
            case "move-y":
              this.element.style[property] = `${
                transformContainer || ""
              } translateY(${value}${unit})`;
              break;
            case "move-z":
              this.element.style[property] = `${
                transformContainer || ""
              } translateZ(${value}${unit})`;
              break;
            case "matrix":
              this.element.style[property] = `${
                transformContainer || ""
              } matrix(${value}${unit})`;
              break;
            case "matrix-3d":
              this.element.style[property] = `${
                transformContainer || ""
              } matrix3d(${value}${unit})`;
              break;
            case "scale-3d":
              this.element.style[property] = `${
                transformContainer || ""
              } scale3d(${value}${unit})`;
              break;
            case "scale":
              this.element.style[property] = `${
                transformContainer || ""
              } scale(${value}${unit})`;
              break;
            case "scale-x":
              this.element.style[property] = `${
                transformContainer || ""
              } scaleX(${value}${unit})`;
              break;
            case "scale-y":
              this.element.style[property] = `${
                transformContainer || ""
              } scaleY(${value}${unit})`;
              break;
            case "scale-z":
              this.element.style[property] = `${
                transformContainer || ""
              } scaleZ(${value}${unit})`;
              break;
            case "skew-x":
              this.element.style[property] = `${
                transformContainer || ""
              } skewX(${value}${unit})`;
              break;
            case "skew-y":
              this.element.style[property] = `${
                transformContainer || ""
              } skewY(${value}${unit})`;
              break;
            case "skew-z":
              this.element.style[property] = `${
                transformContainer || ""
              } skewZ(${value}${unit})`;
              break;
            default:
              break;
          }
        }
        /*
         * CSS Variable Support 🎋
         *
         * Check className if the `value` is wrapped with `[]`,
         * if so then this is treated as css variable, css value.
         */
        // Check if the value is a CSS variable enclosed in square brackets
        else if (value.startsWith("[") && value.endsWith("]")) {
          // Slice value from the box and identify the
          const cssVariable = value.slice(1, -1);
          this.element.style[property] = `var(--${cssVariable})`;
        }
        // Default value and unit
        else {
          this.element.style[property] = `${value}${unit}`;
        }
      });
    }
  }

  // Handle all possible values
  applyStyles(className: string): void {
    // Using RegExp to handle the value
    const match = className.match(
      /([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\]))([a-zA-Z%]*)/
    );
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
  applyMultiStyles(styles: string): void {
    // Splitting the styles
    const styleArray = styles.split(/\s+/);
    // Applying the styles using forEach and `applyStyles`
    styleArray.forEach((style: string) => {
      this.applyStyles(style);
    });
  }
}

// Applied multi style into all elements with the specified element (not just className)
function makeStyle(
  selector: string,
  styles: string | Record<string, string>
): void {
  const applyStylesToElement = (element: HTMLElement, styles: string): void => {
    // make new styler
    const styler = new makeTenoxUI(element);
    styler.applyMultiStyles(styles);
  };
  // Make sure to run only on browser environment
  if (typeof window !== "undefined") {
    if (typeof styles === "string") {
      // If styles is a string, apply it to the specified selector
      const elements = document.querySelectorAll(selector);
      elements.forEach((element: HTMLElement) =>
        applyStylesToElement(element, styles)
      );
    } else if (typeof styles === "object") {
      // If styles is an object, iterate through its key-value pairs
      Object.entries(styles).forEach(([classSelector, classStyles]) => {
        const elements = document.querySelectorAll(classSelector);
        elements.forEach((element: HTMLElement) =>
          applyStylesToElement(element, classStyles)
        );
      });
    }
    // Error Handling for make Style
    else {
      console.warn(
        `Invalid styles format for "${selector}". Make sure you provide style correctly`
      );
    }
  }
}

// MultiProps function: Add multiple properties from the provided object
function defineProps(propsObject: Record<string, string | string[]>): void {
  // Iterate over object entries
  Object.entries(propsObject).forEach(([propName, propValues]) => {
    // Check if propValues is an array or string
    if (typeof propValues !== "string" && !Array.isArray(propValues)) {
      console.warn(
        `Invalid property values for "${propName}". Make sure you provide values as an array.`
      );
    }

    // if the propValues is a string, convert into array
    const processedValues: string[] =
      typeof propValues === "string" ? [propValues] : (propValues as string[]);

    // Create a new CustomProperty
    const propInstance = new newProp(propName, processedValues);
    // Add it to AllProperty at once
    propInstance.tryAdd();
  });
}

type StylesObject = Record<string, string | Record<string, string>>;

function makeStyles(
  stylesObject: StylesObject
): Record<string, string | Record<string, string>> {
  const definedStyles: Record<string, string | Record<string, string>> = {};

  const applyStylesToElement = (
    element: HTMLElement,
    styles: string | Record<string, string>
  ): void => {
    const styler = new makeTenoxUI(element);
    if (typeof styles === "string") {
      styler.applyMultiStyles(styles);
    } else {
      for (const [prop, value] of Object.entries(styles)) {
        styler.applyStyle(prop, value, "");
      }
    }
  };

  const applyNestedStyles = (
    parentSelector: string,
    styles: Record<string, string>
  ): void => {
    Object.entries(styles).forEach(([childSelector, childStyles]) => {
      const elements = document.querySelectorAll<HTMLElement>(
        `${parentSelector} ${childSelector}`
      );
      if (typeof childStyles === "object" && !Array.isArray(childStyles)) {
        applyNestedStyles(`${parentSelector} ${childSelector}`, childStyles);
      } else {
        elements.forEach((element) => {
          applyStylesToElement(element, childStyles);
        });
      }
    });
  };

  for (const [selector, styles] of Object.entries(stylesObject)) {
    if (typeof styles === "object" && !Array.isArray(styles)) {
      applyNestedStyles(selector, styles);
    } else {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((element) => {
        applyStylesToElement(element, styles);
      });
    }
    definedStyles[selector] = styles;
  }

  return definedStyles;
}

// More color compability, for hex, rgb, and rgba
function moreColor() {
  // Makd color function
  const makeColor = (
    element: HTMLElement,
    pattern: RegExp,
    property: string,
    format: (match: RegExpMatchArray) => string
  ) => {
    // Match the class name against the provided pattern
    const match = element.className.match(pattern);
    // If there is a match, apply the style to the element using the specified property and format
    if (match) {
      element.style[property] = format(match);
    }
  };
  let colorClass: NodeListOf<HTMLElement>;
  if (typeof window !== "undefined") {
    // Select all elements with classes related to colors (background, text, border)
    colorClass = document.querySelectorAll<HTMLElement>(
      '[class*="bg-"], [class*="tc-"], [class*="border-"]'
    );
  }
  // Define mappings for color types and corresponding CSS properties
  const colorTypes: Record<string, string> = {
    bg: "background",
    tc: "color",
    border: "borderColor",
  };
  // Define different color formats and their corresponding formatting functions
  const colorFormats: Record<string, (match: RegExpMatchArray) => string> = {
    // rgb
    rgb: (match) => `rgb(${match.slice(1, 4).join(",")})`,
    // rgba
    rgba: (match) => `rgba(${match.slice(1, 5).join(",")})`,
    // hex
    hex: (match) => `#${match[1]}`,
  };
  // Iterate through each element with color-related classes
  colorClass.forEach((element: HTMLElement) => {
    // Iterate through each color type (bg, tc, border)
    for (const type in colorTypes) {
      // Iterate through each color format (rgb, rgba, hex)
      for (const format in colorFormats) {
        // Create a pattern for the specific color type and format
        const pattern = new RegExp(`${type}-${format}\\(([^)]+)\\)`);
        // Apply color to the element using the makeColor function
        makeColor(element, pattern, colorTypes[type], colorFormats[format]);
      }
      // Create a pattern for hex color format
      const hexPattern = new RegExp(`${type}-([0-9a-fA-F]{3,6})`);
      // Apply color to the element using the makeColor function for hex format
      makeColor(element, hexPattern, colorTypes[type], colorFormats["hex"]);
    }
  });
}

// Applying the style to all elements ✨
function tenoxui(): void {
  // Make classes from type name from properties key name
  Classes = Object.keys(property).map(
    (className) => `[class*="${className}-"]`
  );

  // Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
  AllClasses = document.querySelectorAll(Classes.join(", "));
  // Iterate over elements with AllClasses
  AllClasses.forEach((element: HTMLElement) => {
    // Get the list of classes for the current element
    const classes = element.classList;
    // Make TenoxUI
    const makeTx = new makeTenoxUI(element);
    // Iterate over classes and apply styles using makeTenoxUI
    classes.forEach((className) => {
      makeTx.applyStyles(className);
    });
  });
}

export {
  Classes,
  AllClasses,
  addType,
  defineProps,
  makeStyle,
  makeStyles,
  moreColor,
  makeTenoxUI,
};
export default tenoxui;
