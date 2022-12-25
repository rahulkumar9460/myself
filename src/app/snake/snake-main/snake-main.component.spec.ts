import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakeMainComponent } from './snake-main.component';

describe('SnakeMainComponent', () => {
  let component: SnakeMainComponent;
  let fixture: ComponentFixture<SnakeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnakeMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnakeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
