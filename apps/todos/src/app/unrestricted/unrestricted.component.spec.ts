import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UnrestrictedComponent } from './unrestricted.component';

describe('UnrestrictedComponent', () => {
  let component: UnrestrictedComponent;
  let fixture: ComponentFixture<UnrestrictedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnrestrictedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnrestrictedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
