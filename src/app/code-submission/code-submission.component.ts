import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-code-submission',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './code-submission.component.html',
  styleUrl: './code-submission.component.css'
})
export class CodeSubmissionComponent implements OnInit {
  @Input() initialCode: string = '';
  @Input() language: string = 'javascript'; // Default language
  @Input() theme: string = 'vs-light'; // Default theme

  ngOnInit() {
    this.createEditor();
  }

  createEditor() {
    monaco.editor.create(document.getElementById('editorContainer')!, {
      value: this.initialCode,
      language: this.language,
      automaticLayout: true,
      theme: this.theme, // Light theme, you can change to 'vs-dark'
    });
  }
}
