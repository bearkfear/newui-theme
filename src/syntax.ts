import type { Tokens } from './tokens.js';
export interface TextMateRule { name: string; scope: string[]; settings: { foreground: string; fontStyle?: string } }
export type SemanticStyle = { foreground: string; bold?: boolean; italic?: boolean; underline?: boolean };

export function syntax(t: Tokens) {
  const s = t.syntax;
  const rules: TextMateRule[] = [];
  function rule(name: string, scope: string[], foreground: string, fontStyle?: string) {
    rules.push({ name, scope, settings: { foreground, ...(fontStyle !== undefined ? { fontStyle } : {}) } });
  }
  rule('Comments', ['comment', 'punctuation.definition.comment'], s.comment, '');
  rule('Documentation', ['comment.block.documentation', 'comment.line.documentation', 'comment.block.phpdoc'], s.documentation, '');
  rule('Documentation tags', ['storage.type.class.jsdoc', 'storage.type.class.phpdoc', 'keyword.other.documentation'], s.documentation);
  rule('Documentation types stay quiet', ['entity.name.type.instance.jsdoc', 'entity.name.type.instance.phpdoc', 'comment.block.documentation entity.name.type', 'comment.block.phpdoc entity.name.type'], s.documentation);
  rule('Keywords and control flow', ['keyword.control', 'keyword.other'], s.keyword);
  rule('Declaration words', ['storage.type'], s.declaration);
  rule('Modifiers', ['storage.modifier', 'keyword.other.modifier', 'keyword.control.export', 'keyword.control.import', 'keyword.control.from', 'keyword.control.as'], s.modifier);
  rule('Operators including arrows, coalescing, optional access and assignments', [
    'keyword.operator', 'storage.type.function.arrow', 'punctuation.accessor.optional',
    'punctuation.separator.question-mark', 'punctuation.separator.key-value',
  ], s.operator);
  // Never color a meta.function or meta.type container: it would recolor its children.
  rule('Functions and methods', ['entity.name.function', 'support.function', 'variable.function', 'support.constant.handlebars'], s.function);
  rule('Function declarations', ['meta.function entity.name.function', 'meta.function.declaration entity.name.function', 'meta.method.declaration entity.name.function'], s.functionDeclaration, t.declarationBold ? 'bold' : '');
  rule('User types, interfaces, enums, structs and traits', ['entity.name.type', 'entity.name.class', 'entity.other.inherited-class', 'support.class', 'support.type', 'storage.type.trait'], s.type);
  rule('Primitive types', ['storage.type.primitive', 'support.type.primitive', 'support.type.builtin', 'storage.type.numeric', 'storage.type.string', 'storage.type.boolean', 'storage.type.built-in', 'storage.type.cs'], s.primitive);
  rule('Strings and characters', ['string', 'constant.character'], s.string);
  rule('Escapes and interpolation boundaries', ['constant.character.escape', 'punctuation.definition.template-expression', 'punctuation.section.embedded'], s.escape);
  rule('Numbers', ['constant.numeric'], s.constant);
  rule('Booleans and nullish values', ['constant.language', 'support.constant'], s.boolean);
  rule('Named constants and enum members', ['variable.other.constant', 'entity.name.constant', 'variable.other.enummember', 'constant.other.enum'], s.constant);
  rule('Local identifiers remain neutral', ['variable.other.readwrite', 'variable.other.object', 'variable.other.php'], s.plain);
  rule('Parameters', ['variable.parameter', 'variable.other.parameter'], s.parameter);
  rule('Properties', ['variable.other.property', 'variable.object.property', 'support.variable.property', 'meta.object-literal.key'], s.property);
  rule('Namespaces and modules', ['entity.name.namespace', 'entity.name.module', 'entity.name.scope-resolution', 'support.other.namespace'], s.namespace);
  rule('Decorators and annotations', ['meta.decorator entity.name.function', 'entity.name.function.decorator', 'entity.name.type.annotation', 'storage.type.annotation', 'punctuation.definition.annotation'], s.decorator);
  rule('Structural punctuation', ['punctuation.definition.block', 'punctuation.section.block', 'punctuation.section.group', 'punctuation.section.parens', 'punctuation.section.brackets', 'punctuation.separator.comma', 'punctuation.terminator.statement', 'punctuation.definition.tag'], s.punctuation);
  rule('HTML and JSX tags', ['entity.name.tag', 'support.class.component'], s.tag);
  rule('HTML and JSX attributes', ['entity.other.attribute-name'], s.attribute);
  rule('HTML and JSX attribute names', ['entity.other.attribute-name.html', 'entity.other.attribute-name.tsx', 'entity.other.attribute-name.js.jsx', 'entity.other.attribute-name.js'], s.markupAttribute);
  rule('HTML and JSX literal attribute values', ['string.quoted.double.html', 'string.quoted.single.html', 'meta.tag.attributes string.quoted'], s.markupString);
  // An expression inside an attribute is code, so preserve its normal string color.
  rule('Strings inside JSX expressions', ['meta.embedded.expression string.quoted'], s.string);
  rule('CSS selectors', ['entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css', 'entity.name.tag.css', 'entity.other.attribute-name.pseudo-class.css', 'entity.other.attribute-name.pseudo-element.css'], s.type);
  rule('CSS properties', ['support.type.property-name', 'support.type.vendored.property-name', 'variable.css'], s.attribute);
  rule('CSS values and units', ['support.constant.property-value', 'keyword.other.unit', 'constant.other.color'], s.constant);
  rule('JSON keys', ['support.type.property-name.json', 'support.type.property-name.jsonc'], s.attribute);
  rule('Rust lifetimes and attributes', ['storage.modifier.lifetime.rust', 'entity.name.type.lifetime.rust', 'meta.attribute.rust'], s.decorator);
  rule('Rust macros', ['entity.name.function.macro', 'support.macro'], s.decorator);
  rule('PHP variables: neutral sigils', ['punctuation.definition.variable.php'], s.parameter);
  rule('Markdown headings', ['markup.heading', 'entity.name.section'], s.type, 'bold');
  rule('Markdown links', ['markup.underline.link', 'string.other.link'], s.function);
  rule('Markdown emphasis', ['markup.italic'], s.plain, 'italic');
  rule('Markdown strong', ['markup.bold'], s.plain, 'bold');
  rule('Markdown inline code', ['markup.inline.raw'], s.string);
  rule('Diff additions', ['markup.inserted'], t.success);
  rule('Diff removals', ['markup.deleted'], t.error);
  rule('Diff changes', ['markup.changed'], t.warning);
  rule('Invalid syntax', ['invalid.illegal'], s.invalid);
  rule('Deprecated syntax', ['invalid.deprecated'], s.invalid, 'strikethrough');

  const semanticTokenColors: Record<string, SemanticStyle> = {};
  function semantic(selectors: string[], foreground: string, extra: Omit<SemanticStyle, 'foreground'> = {}) {
    for (const selector of selectors) semanticTokenColors[selector] = { foreground, ...extra };
  }
  semantic(['namespace'], s.namespace);
  semantic(['type', 'class', 'interface', 'struct', 'enum', 'typeParameter'], s.type);
  semantic(['type.defaultLibrary'], s.primitive);
  semantic(['parameter'], s.parameter);
  semantic(['variable'], s.plain);
  // readonly includes ordinary JS const locals: keep them neutral; enumMember is explicit.
  semantic(['property'], s.property);
  semantic(['enumMember'], s.constant);
  semantic(['function', 'method'], s.function);
  semantic(['function.declaration', 'method.declaration', 'function.definition', 'method.definition'], s.functionDeclaration, { bold: t.declarationBold });
  semantic(['macro', 'decorator'], s.decorator);
  semantic(['keyword'], s.keyword);
  semantic(['modifier'], s.modifier);
  semantic(['operator'], s.operator);
  semantic(['string', 'regexp'], s.string);
  semantic(['number'], s.constant);
  semantic(['comment'], s.comment, { italic: false });
  semantic(['comment.documentation'], s.documentation);
  return { tokenColors: rules, semanticTokenColors };
}
