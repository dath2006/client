"use client";

import React, { useState } from "react";
import Toggle from "../../common/Toggle";

const MathJaxSettingsPage = () => {
  const [formData, setFormData] = useState({
    texLatexSupport: false,
    mathmlSupport: false,
  });

  const handleInputChange = (field: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving MathJax settings:", formData);
  };

  const generateMathPreview = () => {
    return (
      <div className="space-y-4">
        {formData.texLatexSupport && (
          <div className="p-4 bg-card rounded-lg border border-success/20">
            <h5 className="font-medium text-success mb-2">
              TeX/LaTeX Examples
            </h5>
            <div className="space-y-2 font-mono text-sm">
              <div className="p-2 bg-surface rounded">
                <code className="text-primary">
                  {"$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$"}
                </code>
                <div className="mt-2 text-lg text-center">
                  ∫₀^∞ e^(-x²) dx = √π/2
                </div>
              </div>
              <div className="p-2 bg-surface rounded">
                <code className="text-primary">{"\\(E = mc^2\\)"}</code>
                <div className="mt-2 text-lg">E = mc²</div>
              </div>
            </div>
          </div>
        )}

        {formData.mathmlSupport && (
          <div className="p-4 bg-card rounded-lg border border-primary/20">
            <h5 className="font-medium text-primary mb-2">MathML Example</h5>
            <div className="font-mono text-sm">
              <div className="p-2 bg-surface rounded">
                <code className="text-primary text-xs">
                  {
                    "<math><mi>x</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>±</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math>"
                  }
                </code>
                <div className="mt-2 text-lg">x = (-b ± √(b² - 4ac)) / 2a</div>
              </div>
            </div>
          </div>
        )}

        {!formData.texLatexSupport && !formData.mathmlSupport && (
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg text-center">
            <p className="text-warning font-medium">No math support enabled</p>
            <p className="text-secondary text-sm mt-1">
              Enable at least one format to see math rendering
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          MathJax Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure mathematical notation rendering and input formats
        </p>
      </div>

      <div className="space-y-6">
        {/* Math Format Support */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Mathematics Input Formats
          </h2>

          {/* TeX and LaTeX Support */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                TeX and LaTeX Support
              </label>
              <p className="text-xs text-secondary mt-1">
                Enable rendering of TeX and LaTeX mathematical notation using $$
                and \( \) delimiters.
              </p>
            </div>
            <Toggle
              checked={formData.texLatexSupport}
              onChange={(checked) =>
                handleInputChange("texLatexSupport", checked)
              }
              label="TeX and LaTeX Support toggle"
              variant="success"
              size="md"
            />
          </div>

          {/* MathML Support */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                MathML Support
              </label>
              <p className="text-xs text-secondary mt-1">
                Enable rendering of MathML (Mathematical Markup Language)
                elements.
              </p>
            </div>
            <Toggle
              checked={formData.mathmlSupport}
              onChange={(checked) =>
                handleInputChange("mathmlSupport", checked)
              }
              label="MathML Support toggle"
              variant="primary"
              size="md"
            />
          </div>
        </div>

        {/* Math Preview */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Math Rendering Preview
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <h4 className="font-medium text-primary mb-4">
              How math will render:
            </h4>
            {generateMathPreview()}
          </div>
        </div>

        {/* Input Format Guide */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Input Format Guide
          </h2>

          {/* TeX/LaTeX Guide */}
          <div className="space-y-4">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.texLatexSupport ? "bg-success" : "bg-gray-300"
                  }`}
                ></span>
                <h4 className="font-medium text-primary">
                  TeX and LaTeX Format
                </h4>
              </div>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-secondary mb-2">
                    Inline Math (within text):
                  </h5>
                  <div className="p-3 bg-default/30 rounded font-mono text-sm">
                    <code className="text-primary">
                      {"\\(x^2 + y^2 = z^2\\)"}
                    </code>
                    <div className="text-xs text-secondary mt-1">
                      Use \( and \) for inline equations
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-secondary mb-2">
                    Display Math (centered block):
                  </h5>
                  <div className="p-3 bg-default/30 rounded font-mono text-sm">
                    <code className="text-primary">
                      {"$$\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$$"}
                    </code>
                    <div className="text-xs text-secondary mt-1">
                      Use $$ and $$ for display equations
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MathML Guide */}
            <div className="p-4 bg-surface rounded-lg border border-default">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.mathmlSupport ? "bg-primary" : "bg-gray-300"
                  }`}
                ></span>
                <h4 className="font-medium text-primary">MathML Format</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-secondary mb-2">
                    MathML Elements:
                  </h5>
                  <div className="p-3 bg-default/30 rounded font-mono text-xs">
                    <code className="text-primary block mb-2">
                      {'<math display="block">'}
                    </code>
                    <code className="text-primary block ml-4 mb-2">
                      {
                        "<mi>x</mi><mo>=</mo><mfrac><mi>a</mi><mi>b</mi></mfrac>"
                      }
                    </code>
                    <code className="text-primary block">{"</math>"}</code>
                    <div className="text-xs text-secondary mt-2">
                      Standard MathML markup
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Symbols Reference */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Common Mathematical Symbols
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                symbol: "\\frac{a}{b}",
                display: "a/b",
                description: "Fraction",
              },
              { symbol: "x^{2}", display: "x²", description: "Superscript" },
              { symbol: "x_{i}", display: "xᵢ", description: "Subscript" },
              {
                symbol: "\\sqrt{x}",
                display: "√x",
                description: "Square root",
              },
              { symbol: "\\int", display: "∫", description: "Integral" },
              { symbol: "\\sum", display: "∑", description: "Summation" },
              { symbol: "\\alpha", display: "α", description: "Greek alpha" },
              { symbol: "\\beta", display: "β", description: "Greek beta" },
              { symbol: "\\infty", display: "∞", description: "Infinity" },
              { symbol: "\\pi", display: "π", description: "Pi" },
              { symbol: "\\theta", display: "θ", description: "Theta" },
              { symbol: "\\leq", display: "≤", description: "Less or equal" },
            ].map((item) => (
              <div
                key={item.symbol}
                className="p-3 bg-surface rounded-lg border border-default"
              >
                <div className="font-mono text-sm text-primary mb-1">
                  {item.symbol}
                </div>
                <div className="text-lg mb-1">{item.display}</div>
                <div className="text-xs text-secondary">{item.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Information */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            About MathJax
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <p className="text-secondary text-sm leading-relaxed mb-4">
              MathJax is a JavaScript display engine for mathematics that works
              in all modern browsers. It renders mathematical notation using web
              fonts or SVG, making complex equations accessible and beautifully
              formatted across all devices.
            </p>
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Key Features:</h4>
              <ul className="text-sm text-secondary space-y-1 ml-4">
                <li>
                  • <strong>Universal Compatibility:</strong> Works in all
                  modern browsers
                </li>
                <li>
                  • <strong>High Quality Output:</strong> Professional-quality
                  mathematical typography
                </li>
                <li>
                  • <strong>Accessibility:</strong> Screen reader compatible
                  with proper markup
                </li>
                <li>
                  • <strong>Scalable:</strong> Equations scale with text and
                  zoom properly
                </li>
                <li>
                  • <strong>Copy & Paste:</strong> Right-click to copy equations
                  in various formats
                </li>
                <li>
                  • <strong>Mobile Friendly:</strong> Touch-optimized for mobile
                  devices
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Considerations */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Performance & Best Practices
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">
                Performance Tips
              </h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• MathJax loads only when math content is detected</li>
                <li>• Use appropriate delimiters for your content type</li>
                <li>• Enable only formats you actually need</li>
                <li>• Complex equations may take slightly longer to render</li>
              </ul>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Best Practices</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Use display math ($$) for standalone equations</li>
                <li>• Use inline math \( \) within paragraphs</li>
                <li>• Test equations in preview before publishing</li>
                <li>• Provide text alternatives for complex formulas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Current Configuration
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">
                TeX/LaTeX Support
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.texLatexSupport ? "bg-success" : "bg-warning"
                  }`}
                ></span>
                <span className="text-sm text-secondary">
                  {formData.texLatexSupport ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-secondary">
                {formData.texLatexSupport
                  ? "Supports $$ and \\( \\) delimiters for math notation"
                  : "TeX and LaTeX input is currently disabled"}
              </p>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">MathML Support</h4>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.mathmlSupport ? "bg-primary" : "bg-warning"
                  }`}
                ></span>
                <span className="text-sm text-secondary">
                  {formData.mathmlSupport ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-secondary">
                {formData.mathmlSupport
                  ? "Supports MathML markup for mathematical expressions"
                  : "MathML input is currently disabled"}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            className="btn-primary px-6 py-3 font-medium"
          >
            Update MathJax Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathJaxSettingsPage;
