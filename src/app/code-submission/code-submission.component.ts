import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Logger} from '../service/logger/logger.service';
import {java} from '@codemirror/lang-java';
import {python} from '@codemirror/lang-python';
import {javascript} from '@codemirror/lang-javascript';
import {csharp} from '@replit/codemirror-lang-csharp';
import {cpp} from '@codemirror/lang-cpp';
import {EditorView, keymap} from '@codemirror/view';
import {EditorState} from '@codemirror/state';
import {basicSetup} from 'codemirror';
import {php} from '@codemirror/lang-php';
import {go} from '@codemirror/lang-go';
import {rust} from '@codemirror/lang-rust';
import {autocompletion} from '@codemirror/autocomplete';
import {indentWithTab} from '@codemirror/commands';

@Component({
  selector: 'app-code-submission',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './code-submission.component.html',
  styleUrl: './code-submission.component.css'
})
export class CodeSubmissionComponent implements OnInit, AfterViewInit {

  @Input() initialCode: string = '';
  @Input() language: string = 'javascript';
  @Input() theme!: string;

  @ViewChild('editor', {static: true}) editorElement!: ElementRef;
  editorView!: EditorView;


  ngAfterViewInit(): void {
    this.createEditor();
  }

  ngOnInit() {

  }

  createEditor() {
    try {
      Logger.log("language: " + this.language);

      const extensions = [basicSetup,
        this.getLanguageExtension(this.language),
        keymap.of([indentWithTab]),
        autocompletion()];

      const startState = EditorState.create({
        doc: this.initialCode,
        extensions: extensions
      });

      this.editorView = new EditorView({
        state: startState,
        parent: this.editorElement.nativeElement
      });


    } catch (e) {
      Logger.log(e);
    }
  }

  getLanguageExtension(language: string) {
    switch (language.toLowerCase()) {
      case 'java':
        return java();
      case 'python':
        return python();
      case 'python3':
        return python();
      case 'c':
        return cpp();
      case 'csharp':
        return csharp();
      case 'javascript':
        return javascript();
      case 'cpp':
        return cpp();
      case 'php':
        return php();
      case 'kotlin':
        return java();
      case 'dart':
        return javascript();
      case 'go':
        return go();
      case 'scala':
        return java();
      case 'rust':
        return rust();
      default:
        return javascript();
    }
  }

//swift ruby racket erlang elixir
}
