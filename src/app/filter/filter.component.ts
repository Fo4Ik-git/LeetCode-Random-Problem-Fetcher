import {Component, EventEmitter, Input, Output} from '@angular/core';
import {tags} from '../tags';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Output() applyFiltersEvent = new EventEmitter<{ difficulty: string, tags: string[] }>();
  @Output() closeFilterModalEvent = new EventEmitter<void>();
  @Input() showFilterModal = false;
  searchQuery: string = '';
  selectedDifficulty: string = '';
  selectedTags: string[] = [];
  availableTags = tags;
  filteredTags = [...this.availableTags];

  openFilterModal() {
    this.showFilterModal = true;
  }

  closeFilterModal() {
    this.showFilterModal = false;
    this.closeFilterModalEvent.emit();
  }

  filterTags() {
    const query = this.searchQuery.toLowerCase();
    this.filteredTags = this.availableTags.filter(tag =>
      tag.label.toLowerCase().includes(query)
    );
  }

  toggleTag(tag: { value: string; label: string; selected: boolean }) {
    tag.selected = !tag.selected;
    const index = this.selectedTags.indexOf(tag.value);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag.value);
    }
  }

  getSelectedTags(): string[] {
    return this.selectedTags;
  }

  applyFilters() {
    this.applyFiltersEvent.emit({difficulty: this.selectedDifficulty, tags: this.getSelectedTags()});
    this.showFilterModal = false;
    this.closeFilterModalEvent.emit();
  }
}
