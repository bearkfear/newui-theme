import { color as c } from './palette.js';
import type { Tokens } from './tokens.js';

export function workbench(t: Tokens): Record<string, string> {
  const colors: Record<string, string> = {};
  function set(value: string, ...keys: string[]) { for (const key of keys) { if (key in colors) throw new Error(`Duplicate UI key: ${key}`); colors[key] = value; } }
  set(t.text, 'foreground', 'editor.foreground', 'input.foreground', 'dropdown.foreground', 'menu.foreground', 'quickInput.foreground', 'list.activeSelectionForeground', 'list.inactiveSelectionForeground', 'list.hoverForeground', 'tab.activeForeground', 'editorSuggestWidget.foreground', 'editorHoverWidget.foreground', 'terminal.foreground', 'notificationCenterHeader.foreground', 'notifications.foreground');
  set(t.secondary, 'descriptionForeground', 'sideBar.foreground', 'activityBar.foreground', 'statusBar.foreground', 'statusBar.noFolderForeground', 'titleBar.activeForeground', 'tab.inactiveForeground', 'tab.unfocusedActiveForeground', 'breadcrumb.foreground', 'editorLineNumber.activeForeground', 'panelTitle.inactiveForeground', 'input.placeholderForeground', 'pickerGroup.foreground', 'editorCodeLens.foreground', 'editorInlayHint.foreground');
  set(t.muted, 'disabledForeground', 'activityBar.inactiveForeground', 'titleBar.inactiveForeground', 'tab.unfocusedInactiveForeground', 'editorLineNumber.foreground', 'editorWhitespace.foreground');
  set(t.canvas, 'sideBar.background', 'activityBar.background', 'titleBar.activeBackground', 'titleBar.inactiveBackground', 'statusBar.background', 'statusBar.noFolderBackground', 'editorGroupHeader.tabsBackground', 'tab.inactiveBackground', 'panel.background', 'terminal.background');
  set(t.editor, 'editor.background', 'editorGutter.background', 'tab.activeBackground', 'tab.unfocusedActiveBackground', 'input.background', 'sideBarSectionHeader.background', 'editorStickyScroll.background', 'editorOverviewRuler.background', 'breadcrumb.background', 'editorGroupHeader.border');
  set(t.surface, 'dropdown.background', 'menu.background', 'quickInput.background', 'editorWidget.background', 'editorSuggestWidget.background', 'editorHoverWidget.background', 'notifications.background', 'notificationCenterHeader.background', 'editorMarkerNavigation.background', 'peekViewEditor.background', 'peekViewResult.background', 'peekViewTitle.background', 'breadcrumbPicker.background', 'editorInlayHint.background');
  set(t.hover, 'list.hoverBackground', 'toolbar.hoverBackground', 'menubar.selectionBackground', 'editor.lineHighlightBackground', 'editorSuggestWidget.selectedBackground', 'quickInputTitle.background', 'statusBarItem.hoverBackground');
  set(t.pressed, 'list.inactiveSelectionBackground', 'list.focusBackground', 'button.secondaryBackground', 'editorWidget.resizeBorder', 'editorHoverWidget.statusBarBackground');
  set(t.hover, 'list.activeSelectionBackground', 'quickInputList.focusBackground', 'menu.selectionBackground');
  set(t.text, 'quickInputList.focusForeground', 'menu.selectionForeground', 'button.secondaryForeground', 'statusBar.debuggingForeground');
  set(t.border, 'sideBar.border', 'activityBar.border', 'titleBar.border', 'statusBar.border', 'panel.border', 'tab.border', 'editorGroup.border', 'menu.separatorBackground', 'editorWidget.border', 'editorHoverWidget.border', 'editorSuggestWidget.border', 'notifications.border', 'peekView.border', 'editorStickyScroll.border');
  set(t.surface, 'editorGroupHeader.tabsBorder');
  set(t.controlBorder, 'input.border', 'dropdown.border', 'menu.border', 'button.border', 'widget.border', 'editorRuler.foreground');
  set(t.focus, 'focusBorder', 'inputOption.activeBorder', 'list.focusOutline');
  set(t.accent, 'textLink.foreground', 'textLink.activeForeground', 'progressBar.background', 'list.highlightForeground', 'list.focusHighlightForeground', 'editorSuggestWidget.highlightForeground', 'editorSuggestWidget.focusHighlightForeground');
  set(t.secondary, 'activityBar.activeBorder', 'tab.activeBorderTop', 'panelTitle.activeBorder', 'badge.background', 'activityBarBadge.background');
  set(t.text, 'panelTitle.activeForeground', 'editorCursor.foreground', 'breadcrumb.focusForeground', 'breadcrumb.activeSelectionForeground');
  set(c('slate', 1), 'badge.foreground', 'activityBarBadge.foreground', 'button.foreground');
  set(t.accent, 'button.background');
  set(c('blue', 12), 'button.hoverBackground');
  set(t.hover, 'button.secondaryHoverBackground');
  set(t.surface, 'statusBar.debuggingBackground', 'statusBarItem.remoteBackground', 'inputOption.activeBackground');
  set(t.secondary, 'statusBarItem.remoteForeground', 'inputOption.activeForeground');
  set(t.shadow, 'widget.shadow', 'scrollbar.shadow');
  set(c('slate', 5, true), 'scrollbarSlider.background');
  set(c('slate', 7, true), 'scrollbarSlider.hoverBackground');
  set(c('slate', 8, true), 'scrollbarSlider.activeBackground');
  set(t.selection, 'editor.selectionBackground', 'terminal.selectionBackground', 'editor.selectionHighlightBackground', 'editor.inactiveSelectionBackground');
  set(t.selectionInactive, 'editor.wordHighlightBackground', 'editor.rangeHighlightBackground');
  set(t.highlight, 'editor.wordHighlightStrongBackground', 'editor.hoverHighlightBackground', 'editor.linkedEditingBackground');
  set(c('amber', 5, true), 'editor.findMatchHighlightBackground', 'editor.findRangeHighlightBackground', 'searchEditor.findMatchBackground');
  set(c('amber', 7, true), 'editor.findMatchBackground');
  set(c('amber', 8), 'editor.findMatchBorder', 'editor.findMatchHighlightBorder');
  set(t.guide, 'editorIndentGuide.background1', 'tree.indentGuidesStroke');
  set(t.guideActive, 'editorIndentGuide.activeBackground1');
  set(t.success, 'gitDecoration.addedResourceForeground', 'gitDecoration.untrackedResourceForeground', 'editorGutter.addedBackground', 'terminalCommandDecoration.successBackground');
  set(t.info, 'gitDecoration.modifiedResourceForeground', 'editorGutter.modifiedBackground', 'editorInfo.foreground', 'notificationsInfoIcon.foreground');
  set(t.error, 'errorForeground', 'gitDecoration.deletedResourceForeground', 'gitDecoration.conflictingResourceForeground', 'editorGutter.deletedBackground', 'editorError.foreground', 'notificationsErrorIcon.foreground', 'editorBracketHighlight.unexpectedBracket.foreground', 'terminalCommandDecoration.errorBackground');
  set(t.warning, 'editorWarning.foreground', 'notificationsWarningIcon.foreground', 'gitDecoration.renamedResourceForeground');
  set(t.muted, 'gitDecoration.ignoredResourceForeground');
  set(t.added, 'diffEditor.insertedTextBackground', 'diffEditor.insertedLineBackground');
  set(t.removed, 'diffEditor.removedTextBackground', 'diffEditor.removedLineBackground');
  set(c('green', 5, true), 'diffEditorGutter.insertedLineBackground', 'minimapGutter.addedBackground');
  set(c('red', 5, true), 'diffEditorGutter.removedLineBackground', 'minimapGutter.deletedBackground');
  set(c('cyan', 5, true), 'minimapGutter.modifiedBackground');
  set(c('red', 8, true), 'editorOverviewRuler.errorForeground', 'minimap.errorHighlight');
  set(c('amber', 8, true), 'editorOverviewRuler.warningForeground', 'minimap.warningHighlight');
  set(c('cyan', 8, true), 'editorOverviewRuler.infoForeground');
  set(t.selection, 'minimap.selectionHighlight', 'editorOverviewRuler.selectionHighlightForeground');
  set(c('green', 4), 'merge.currentHeaderBackground');
  set(c('cyan', 4), 'merge.incomingHeaderBackground');
  set(c('green', 3, true), 'merge.currentContentBackground');
  set(c('cyan', 3, true), 'merge.incomingContentBackground');
  set(c('red', 3), 'inputValidation.errorBackground', 'statusBarItem.errorBackground');
  set(c('red', 7), 'inputValidation.errorBorder');
  set(c('amber', 3), 'inputValidation.warningBackground', 'statusBarItem.warningBackground');
  set(c('amber', 7), 'inputValidation.warningBorder');
  set(c('cyan', 3), 'inputValidation.infoBackground');
  set(c('cyan', 7), 'inputValidation.infoBorder');
  set(t.error, 'statusBarItem.errorForeground');
  set(t.warning, 'statusBarItem.warningForeground');
  // Neutral at every depth: rainbow brackets otherwise dominate short functions.
  const brackets = Array<string>(6).fill(t.syntax.punctuation);
  brackets.forEach((value, i) => set(value, `editorBracketHighlight.foreground${i + 1}`));
  set(t.selectionInactive, 'editorBracketMatch.background');
  set(t.focus, 'editorBracketMatch.border');
  const ansi = {
    Black: c('slate', 3), Red: c('red', 11), Green: c('green', 11), Yellow: c('amber', 11),
    Blue: c('blue', 11), Magenta: c('plum', 11), Cyan: c('cyan', 11), White: c('slate', 11),
    BrightBlack: c('slate', 10), BrightRed: c('red', 12), BrightGreen: c('green', 12), BrightYellow: c('amber', 12),
    BrightBlue: c('blue', 12), BrightMagenta: c('plum', 12), BrightCyan: c('cyan', 12), BrightWhite: c('slate', 12),
  };
  for (const [name, value] of Object.entries(ansi)) set(value, `terminal.ansi${name}`);
  return colors;
}
