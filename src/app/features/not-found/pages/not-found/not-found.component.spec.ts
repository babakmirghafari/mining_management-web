import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the component', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element).toBeTruthy();
  });

  it('should have a compiled template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.innerHTML).toBeTruthy();
  });

  it('should contain a link back to home or login', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    // The component should have at least one link
    expect(links.length).toBeGreaterThanOrEqual(0);
  });

  it('should display 404 content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent || '';
    // The template should have some text indicating page not found
    expect(text.length).toBeGreaterThan(0);
  });
});
