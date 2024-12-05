import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramaviajePage } from './programaviaje.page';

describe('ProgramaviajePage', () => {
  let component: ProgramaviajePage;
  let fixture: ComponentFixture<ProgramaviajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramaviajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
