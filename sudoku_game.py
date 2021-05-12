from turtle import *

setworldcoordinates(0,0,1500,1500)
title('SUDOKU')
bgcolor('#bdadff')
speed(0)
delay(0)
tracer(0)
update()
ht()

#---------------------------------------------------------------------
#------------------- LARGE SQUARE
def largesquare():
    pu()
    goto(50,50)
    pd()
    ht()
    begin_fill()
    fillcolor('black')
    for side in range(4):
        forward(900)
        left(90)
    end_fill()
    
largesquare()

#---------------------------------------------------------------------
#------------------- SMALL SQUARES
xyCoor=[70,280,520,730]
def smallsquares():
    pu()
    xi=yi=0
    while xi<4:
        xCoor=xyCoor[xi]
        while yi<4:
            yCoor=xyCoor[yi]
            pu()
            goto(xCoor,yCoor)
            pd()
            begin_fill()
            fillcolor('white')
            for side in range(4):
                forward(200)
                left(90)
            end_fill()
            yi+=1
        yi=0
        xi+=1
        ht()
smallsquares()
#---------------------------------------------------------------------
##----COORDINATES---------------------------------------------------
rows = [xyCoor[3],xyCoor[2],xyCoor[1],xyCoor[0]] #x coordinates
columns = [xyCoor[0],xyCoor[1],xyCoor[2],xyCoor[3]] #y coordinates
R_C=[]
el=0
for el in range(len(rows)):
    i=0
    for i in range(len(columns)):
        R_C.append([columns[i]+100,rows[el]-20])
        i+=1
    i=0
    el+=1
#---------------------------------------------------------------------
#------------------- SUDOKU SETUP
import random
Start_Puzzle=[]
Puzzle1=[3,4,1,2,' ',' ',' ',' ',' ',' ',' ',' ',1,2,3,4]
Puzzle2=[4,' ',' ',1,' ',1,3,' ',' ',4,1,' ',1,' ',' ',3]
Puzzle3=[3,2,' ',' ',' ',' ',3,2,' ',' ',' ',1,2,1,' ',3]
Puzzle4=[' ',' ',' ',' ',2,3,4,1,3,4,1,2,' ',' ',' ',' ']
Puzzle5=[' ',2,4,' ',1,' ',' ',3,4,' ',' ',2,' ',1,3,' ']
z=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
Puzzlelist=[Puzzle1,Puzzle2,Puzzle3,Puzzle4,Puzzle5]
Start_Puzzle=random.choice(Puzzlelist)
def sudoku_setup():
    el=i1=0
    while el<16:
        pu()
        goto(R_C[el])
        if i1<=16:
            write(Start_Puzzle[i1], align='center', font=('Arial',90))
            ##----------For the boxnumbers---------------------------------------------------
            goto(R_C[el][0]+70,R_C[el][1]+20)
            write(z[el],align='center', font=('Arial',8))
            goto(R_C[el][0]-70,R_C[el][1]-20)
            ##----------End for the boxnumbers-----------------------------------------------
            i1+=1
        else:
            i1+=1
            el-=1
        el+=1
        
Sudoku_Puzzle=Start_Puzzle
Sudoku_Puzzle=[Sudoku_Puzzle[0:4],Sudoku_Puzzle[4:8],Sudoku_Puzzle[8:12],Sudoku_Puzzle[12:16]]
Original=Sudoku_Puzzle.copy()
#----------------------------------------------------------------------------------

##SUDOKU Checker-----------------------------------------------------------------------
def Checker(Sudoku_Puzzle):
    ROW1=[Sudoku_Puzzle[0][0],Sudoku_Puzzle[0][1],Sudoku_Puzzle[0][2],Sudoku_Puzzle[0][3]]
    ROW2=[Sudoku_Puzzle[1][0],Sudoku_Puzzle[1][1],Sudoku_Puzzle[1][2],Sudoku_Puzzle[1][3]]
    ROW3=[Sudoku_Puzzle[2][0],Sudoku_Puzzle[2][1],Sudoku_Puzzle[2][2],Sudoku_Puzzle[2][3]]
    ROW4=[Sudoku_Puzzle[3][0],Sudoku_Puzzle[3][1],Sudoku_Puzzle[3][2],Sudoku_Puzzle[3][3]]
    ROWcoordinates=[ROW1,ROW2,ROW3,ROW4]
    
    COL1=[Sudoku_Puzzle[0][0],Sudoku_Puzzle[1][0],Sudoku_Puzzle[2][0],Sudoku_Puzzle[3][0]]
    COL2=[Sudoku_Puzzle[0][1],Sudoku_Puzzle[1][1],Sudoku_Puzzle[2][1],Sudoku_Puzzle[3][1]]
    COL3=[Sudoku_Puzzle[0][2],Sudoku_Puzzle[1][2],Sudoku_Puzzle[2][2],Sudoku_Puzzle[3][2]]
    COL4=[Sudoku_Puzzle[0][3],Sudoku_Puzzle[1][3],Sudoku_Puzzle[2][3],Sudoku_Puzzle[3][3]]
    COLcoordinates=[COL1,COL2,COL3,COL4]
    
    box1=[Sudoku_Puzzle[0][0],Sudoku_Puzzle[0][1],Sudoku_Puzzle[1][0],Sudoku_Puzzle[1][1]]
    box2=[Sudoku_Puzzle[0][2],Sudoku_Puzzle[0][3],Sudoku_Puzzle[1][2],Sudoku_Puzzle[1][3]]
    box3=[Sudoku_Puzzle[2][0],Sudoku_Puzzle[2][1],Sudoku_Puzzle[3][0],Sudoku_Puzzle[3][1]]
    box4=[Sudoku_Puzzle[2][2],Sudoku_Puzzle[2][3],Sudoku_Puzzle[3][2],Sudoku_Puzzle[3][3]]
    BOXcoordinates=[box1,box2,box3,box4]

    RCB=[]
    el=el1=el2=1
    for num in range(1,5):
        for row in ROWcoordinates:
            rows=row.count(num)
            RCB.append(rows)
        for col in COLcoordinates:
            cols=col.count(num)
            RCB.append(cols)
        for box in BOXcoordinates:
            boxes=box.count(num)
            RCB.append(boxes)
        
    flag=True                   
    for el in RCB:
        if el>=2:
            flag=False
                
    if not flag:
        return False
    else:
        return True

#----------------------------------------------------------------------------------

##GAME RESET-----------------------------------------------------------------------------
def reset():
    largesquare()
    smallsquares()
    sudoku_setup()
#----------------------------------------------------------------------------------

#NO REAL-TIME CORRECTIONS-----------------------------------------------------------------------------
def no_correct():
    for el in range(16):
        x=0
        blankspaces=[]
        boxnum= int(numinput('Choose a Box Number?','''Note: They are the small numbers under the big values.
    **Values will not be placed in a box with a number in it already, but values inputed can be changed.**''',default=None, minval=1,maxval=16))
        r=int((boxnum-1)/4)
        row=Sudoku_Puzzle[r]
        c=int((boxnum%4))-1
        col=Sudoku_Puzzle[r][c]
        Value= int(numinput('Choose a Value?','Note: The value must be between 1 and 4. "0" to erase.', default=0, minval=0, maxval=4))
        index = boxnum-1
        pu()
        goto(R_C[index])
        
        if Sudoku_Puzzle[r][c]==' ':
            write(Value, align='center', font=('Arial',90))
            Sudoku_Puzzle[r][c]=(int(Value))
            
        elif Value==0:
            pu()
            pencolor('white')
            goto(R_C[index])
            write(Sudoku_Puzzle[r][c], align='center', font=('Arial',90))
            pencolor('black')
            Sudoku_Puzzle[r][c]=(' ')
            
            
        for el in Sudoku_Puzzle:
            for i in el:
                if i==' ':
                    x+=1
                    blankspaces.append(x)
            
        if len(blankspaces)==0:
            SUBMIT=textinput('Submit?', 'Do you want to submit? y or n')
            if SUBMIT=='y':
                Checker(Sudoku_Puzzle)
                if Checker(Sudoku_Puzzle):
                    pu()
                    pencolor('blue')
                    goto(650,1000)
                    write('Completed', align='center',font=('Courier New',100))
                    pencolor('black')
                    Reset=textinput('Reset','Do you wish to start a new game: y or n?')
                    if Reset=='y':
                        reset()
                    else:
                        break
 
                else:
                    pu()
                    pencolor('red')
                    goto(650,1000)
                    write('Error', align='center',font=('Times New Roman',100))
                    pencolor('black')
                    Reset=textinput('Reset','Do you wish to start a new game: y or n?')
                    if Reset=='y':
                        reset()
                    else:
                        break
            else:
                Reset=textinput('Reset','Do you wish to start a new game: y or n?')
                if Reset=='y':
                    reset()
                else:
                    break
#----------------------------------------------------------------------------------

##REAL-TIME CORRECTIONS--------------------------------------------------------------------

def correct():
    for el in range(16):
        x=0
        blankspaces=[]
        boxnum= int(numinput('Choose a Box Number?','''Note: They are the small numbers under the big values.
    **Values will not be placed in a box with a number in it already, but values inputed can be changed.**''',default=None, minval=1,maxval=16))
        r=int((boxnum-1)/4)
        c=int((boxnum%4)-1)
        Value= int(numinput('Choose a Value?','Note: The value must be between 1 and 4. "0" to erase', default=0, minval=0, maxval=4))
        index = boxnum-1
        pu()
        goto(R_C[index])
        if Value==0:
            pu()
            pencolor('white')
            goto(R_C[index])
            write(Sudoku_Puzzle[r][c], align='center', font=('Arial',90))
            pencolor('black')
            Sudoku_Puzzle[r][c]=(' ')
            
        elif Sudoku_Puzzle[r][c]==' ':
            write(Value, align='center', font=('Arial',90))
            Sudoku_Puzzle[r][c]=(int(Value))
                
            if Checker(Sudoku_Puzzle)!=True:
                pu()
                pencolor('white')
                goto(R_C[index])
                write(Sudoku_Puzzle[r][c], align='center', font=('Arial',90))
                pencolor('black')
                Sudoku_Puzzle[r][c]=(' ')
                
                
        for el in Sudoku_Puzzle:
            for i in el:
                if i==' ':
                    x+=1
                    blankspaces.append(x)
            
              
        if len(blankspaces)==0:
            break
#----------------------------------------------------------------------------------
           
#CORRECTIONS-----------------------------------------------------------------------------------------
def Correction():
    sudoku_setup()
    Correction=[]
    Correction.append(textinput('Corrections','Do you want real-time corrections: y or n: '))
    if Correction[0]=='y':
        correct()
    elif Correction[0]=='n':
        no_correct()

#----------------------------------------------------------------------------------

#INSTRUCTIONS--------------------------------------------------------------------
def Instructions():
    Instructions=[]
    Instructions.append(textinput('Instructions','''Object: To place a number 1-4 in the empty squares so that each row, each
column and each 2x2 box contains only one number.
How to play:
1) You will be prompted weather or not you want Real time corrections
(corrections as you go) or Corrections at the end. type "y" or "n".
2) Next you will be prompted to input a box number. Note: they are the small
numbers in the boxes counting from 1-16.
3) Next you will be prompted to input a Value between 1 and 4. Note: you
can erase an inputed value so long as it was not part of the original Sudoku
Puzzle.
4) If you choose real time correction, your incorrect answers will be erased
and you will have to fill in the box with a correct number.
5) If you choose the not real time correction, you will not be able to correct
your puzzle after you submit your answers.

Are you ready to play Sudoku: y or n?'''))
    if Instructions=='y' or 'n':
        Instruct=Turtle()
        Instruct.pu()
        Instruct.pencolor('#7A1F57')
        Instruct.goto(1240,250)
        Instruct.write('''You
Got
This!''', align='center', font=('Courier New',90))
        largesquare()
        smallsquares()
        Correction()
Instructions()

