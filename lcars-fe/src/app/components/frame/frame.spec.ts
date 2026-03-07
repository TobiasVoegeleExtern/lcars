import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Frame } from './frame';

describe('Frame', () => {
  let component: Frame;
  let fixture: ComponentFixture<Frame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Frame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Frame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
