import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Graphs } from './graphs';

describe('Graphs', () => {
  let component: Graphs;
  let fixture: ComponentFixture<Graphs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Graphs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Graphs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
