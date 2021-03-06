FasdUAS 1.101.10   ��   ��    k             l     ��  ��    1 + `menu_click`, by Jacob Rus, September 2006     � 	 	 V   ` m e n u _ c l i c k ` ,   b y   J a c o b   R u s ,   S e p t e m b e r   2 0 0 6   
  
 l     ��  ��           �           l     ��  ��    I C Accepts a list of form: `{"Finder", "View", "Arrange By", "Date"}`     �   �   A c c e p t s   a   l i s t   o f   f o r m :   ` { " F i n d e r " ,   " V i e w " ,   " A r r a n g e   B y " ,   " D a t e " } `      l     ��  ��    K E Execute the specified menu item.  In this case, assuming the Finder      �   �   E x e c u t e   t h e   s p e c i f i e d   m e n u   i t e m .     I n   t h i s   c a s e ,   a s s u m i n g   t h e   F i n d e r        l     ��  ��    I C is the active application, arranging the frontmost folder by date.     �   �   i s   t h e   a c t i v e   a p p l i c a t i o n ,   a r r a n g i n g   t h e   f r o n t m o s t   f o l d e r   b y   d a t e .      l     ��������  ��  ��       !   i      " # " I      �� $���� 0 
menu_click   $  %�� % o      ���� 0 mlist mList��  ��   # k     T & &  ' ( ' q       ) ) �� *�� 0 appname appName * �� +�� 0 topmenu topMenu + ������ 0 r  ��   (  , - , l     ��������  ��  ��   -  . / . l     �� 0 1��   0   Validate our input    1 � 2 2 &   V a l i d a t e   o u r   i n p u t /  3 4 3 Z     5 6���� 5 A      7 8 7 n     9 : 9 1    ��
�� 
leng : o     ���� 0 mlist mList 8 m    ����  6 R    �� ;��
�� .ascrerr ****      � **** ; m   
  < < � = = 8 M e n u   l i s t   i s   n o t   l o n g   e n o u g h��  ��  ��   4  > ? > l   ��������  ��  ��   ?  @ A @ l   �� B C��   B ; 5 Set these variables for clarity and brevity later on    C � D D j   S e t   t h e s e   v a r i a b l e s   f o r   c l a r i t y   a n d   b r e v i t y   l a t e r   o n A  E F E r    + G H G l    I���� I n     J K J 7  �� L M
�� 
cobj L m    ����  M m    ����  K o    ���� 0 mlist mList��  ��   H J       N N  O P O o      ���� 0 appname appName P  Q�� Q o      ���� 0 topmenu topMenu��   F  R S R r   , ; T U T l  , 9 V���� V n   , 9 W X W 7 - 9�� Y Z
�� 
cobj Y m   1 3����  Z l  4 8 [���� [ n  4 8 \ ] \ 1   6 8��
�� 
leng ] o   4 6���� 0 mlist mList��  ��   X o   , -���� 0 mlist mList��  ��   U o      ���� 0 r   S  ^ _ ^ l  < <��������  ��  ��   _  ` a ` l  < <�� b c��   b A ; This overly-long line calls the menu_recurse function with    c � d d v   T h i s   o v e r l y - l o n g   l i n e   c a l l s   t h e   m e n u _ r e c u r s e   f u n c t i o n   w i t h a  e f e l  < <�� g h��   g > 8 two arguments: r, and a reference to the top-level menu    h � i i p   t w o   a r g u m e n t s :   r ,   a n d   a   r e f e r e n c e   t o   t h e   t o p - l e v e l   m e n u f  j�� j O  < T k l k n  @ S m n m I   A S�� o���� 0 menu_click_recurse   o  p q p o   A B���� 0 r   q  r�� r l  B O s���� s n  B O t u t l  L O v���� v 4   L O�� w
�� 
menE w o   M N���� 0 topmenu topMenu��  ��   u n  B L x y x l  I L z���� z 4   I L�� {
�� 
mbri { o   J K���� 0 topmenu topMenu��  ��   y n  B I | } | l 	 F I ~���� ~ l  F I ����  4   F I�� �
�� 
mbar � m   G H���� ��  ��  ��  ��   } l  B F ����� � 4   B F�� �
�� 
prcs � o   D E���� 0 appname appName��  ��  ��  ��  ��  ��   n  f   @ A l m   < = � ��                                                                                  sevs  alis    �  Mac OS X                   �Y&�H+     ,System Events.app                                               c��        ����  	                CoreServices    �Y
t      ����       ,   +   *  9Mac OS X:System: Library: CoreServices: System Events.app   $  S y s t e m   E v e n t s . a p p    M a c   O S   X  -System/Library/CoreServices/System Events.app   / ��  ��   !  � � � l     ��������  ��  ��   �  � � � i     � � � I      �� ����� 0 menu_click_recurse   �  � � � o      ���� 0 mlist mList �  ��� � o      ���� 0 parentobject parentObject��  ��   � k     H � �  � � � q       � � �� ��� 0 f   � ������ 0 r  ��   �  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � , & `f` = first item, `r` = rest of items    � � � � L   ` f `   =   f i r s t   i t e m ,   ` r `   =   r e s t   o f   i t e m s �  � � � r      � � � n      � � � 4    �� �
�� 
cobj � m    ����  � o     ���� 0 mlist mList � o      ���� 0 f   �  � � � Z   " � ����� � ?     � � � n   
 � � � 1    
��
�� 
leng � o    ���� 0 mlist mList � m   
 ����  � r     � � � l    ����� � n     � � � 7  �� � �
�� 
cobj � m    ����  � l    ����� � n    � � � 1    ��
�� 
leng � o    ���� 0 mlist mList��  ��   � o    ���� 0 mlist mList��  ��   � o      ���� 0 r  ��  ��   �  � � � l  # #��������  ��  ��   �  � � � l  # #�� � ���   � < 6 either actually click the menu item, or recurse again    � � � � l   e i t h e r   a c t u a l l y   c l i c k   t h e   m e n u   i t e m ,   o r   r e c u r s e   a g a i n �  ��� � O   # H � � � Z   ' G � ��� � � =  ' , � � � n  ' * � � � 1   ( *��
�� 
leng � o   ' (���� 0 mlist mList � m   * +����  � I  / 7�� ���
�� .prcsclicnull��� ��� uiel � n  / 3 � � � 4   0 3�� �
�� 
menI � o   1 2���� 0 f   � o   / 0�� 0 parentobject parentObject��  ��   � n  : G � � � I   ; G�~ ��}�~ 0 menu_click_recurse   �  � � � o   ; <�|�| 0 r   �  ��{ � l  < C ��z�y � n  < C � � � l  @ C ��x�w � 4   @ C�v �
�v 
menE � o   A B�u�u 0 f  �x  �w   � n  < @ � � � l  = @ ��t�s � 4   = @�r �
�r 
menI � o   > ?�q�q 0 f  �t  �s   � o   < =�p�p 0 parentobject parentObject�z  �y  �{  �}   �  f   : ; � m   # $ � ��                                                                                  sevs  alis    �  Mac OS X                   �Y&�H+     ,System Events.app                                               c��        ����  	                CoreServices    �Y
t      ����       ,   +   *  9Mac OS X:System: Library: CoreServices: System Events.app   $  S y s t e m   E v e n t s . a p p    M a c   O S   X  -System/Library/CoreServices/System Events.app   / ��  ��   �  � � � l     �o�n�m�o  �n  �m   �  � � � p     � � �l�k�l 0 
screensize 
screenSize�k   �  � � � p     � � �j�i�j 0 simwidth simWidth�i   �  � � � p     � � �h�g�h 0 thewidth theWidth�g   �  � � � p     � � �f�e�f 0 	theheight 	theHeight�e   �  � � � l     �d�c�b�d  �c  �b   �  � � � l     ��a�` � O      � � � k     � �  � � � r     � � � e     � � n     � � � 1   	 �_
�_ 
pbnd � n    	 � � � m    	�^
�^ 
cwin � 1    �]
�] 
desk � o      �\�\ 0 
screensize 
screenSize �  � � � r     � � � n     � � � 4    �[ �
�[ 
cobj � m    �Z�Z  � o    �Y�Y 0 
screensize 
screenSize � o      �X�X 0 thewidth theWidth �  ��W � r     �  � n     4    �V
�V 
cobj m    �U�U  o    �T�T 0 
screensize 
screenSize  o      �S�S 0 	theheight 	theHeight�W   � m     �                                                                                  MACS  alis    h  Mac OS X                   �Y&�H+     ,
Finder.app                                                      �� �        ����  	                CoreServices    �Y
t      ��r       ,   +   *  2Mac OS X:System: Library: CoreServices: Finder.app   
 F i n d e r . a p p    M a c   O S   X  &System/Library/CoreServices/Finder.app  / ��  �a  �`   �  l     �R�Q�P�R  �Q  �P    l     �O	
�O  	 O I menu_click({"Safari", "Develop", "Simulator", "localhost � index.html"})   
 � �   m e n u _ c l i c k ( { " S a f a r i " ,   " D e v e l o p " ,   " S i m u l a t o r " ,   " l o c a l h o s t      i n d e x . h t m l " } )  l     �N�N   P J document.getElementById('192.168.56.101:5555:com.peerio_devtools_remote')    � �   d o c u m e n t . g e t E l e m e n t B y I d ( ' 1 9 2 . 1 6 8 . 5 6 . 1 0 1 : 5 5 5 5 : c o m . p e e r i o _ d e v t o o l s _ r e m o t e ' )  l     �M�M   4 . i.getElementsByClassName('action')[0].click()    � \   i . g e t E l e m e n t s B y C l a s s N a m e ( ' a c t i o n ' ) [ 0 ] . c l i c k ( )  l   ��L�K O    � k   " �  I  " '�J�I�H
�J .aevtrappnull��� ��� null�I  �H    I  ( -�G�F�E
�G .miscactvnull��� ��� null�F  �E    !  I  . >�D"�C
�D .coreclosnull���     obj " l  . :#�B�A# 6  . :$%$ 2   . 1�@
�@ 
cwin% C   2 9&'& 1   3 5�?
�? 
pnam' m   6 8(( �))  D e v e l o p e r   T o o l s�B  �A  �C  ! *+* I  ? W�>,�=
�> .coredelonull���     obj , l  ? S-�<�;- 6  ? S./. n   ? F010 2   B F�:
�: 
CrTb1 2   ? B�9
�9 
cwin/ C   G R232 1   H L�8
�8 
URL 3 m   M Q44 �55 * h t t p : / / l o c a l h o s t : 3 0 0 0�<  �;  �=  + 676 r   X s898 I  X o�7�6:
�7 .corecrel****      � null�6  : �5;<
�5 
kocl; m   \ _�4
�4 
CrTb< �3=�2
�3 
insh= n   b k>?>  ;   j k? n   b j@A@ 2  f j�1
�1 
CrTbA 4   b f�0B
�0 
cwinB m   d e�/�/ �2  9 o      �.�. 0 mytab myTab7 CDC r   t EFE m   t wGG �HH H h t t p : / / l o c a l h o s t : 3 0 0 0 / w w w / i n d e x . h t m lF n      IJI 1   z ~�-
�- 
URL J o   w z�,�, 0 mytab myTabD KLK l  � ��+MN�+  M  	delay 2   N �OO  	 d e l a y   2L PQP l  � ��*RS�*  R  	tell myTab   S �TT  	 t e l l   m y T a bQ UVU l  � ��)WX�)  W Q K		execute javascript "document.getElementsByClassName('action')[0].click()"   X �YY � 	 	 e x e c u t e   j a v a s c r i p t   " d o c u m e n t . g e t E l e m e n t s B y C l a s s N a m e ( ' a c t i o n ' ) [ 0 ] . c l i c k ( ) "V Z[Z l  � ��(\]�(  \  		end tell   ] �^^  	 e n d   t e l l[ _`_ l  � ��'ab�'  a  	close myTab   b �cc  	 c l o s e   m y T a b` ded l  � ��&fg�&  f  	delay 1   g �hh  	 d e l a y   1e i�%i r   � �jkj J   � �ll mnm m   � ��$�$  n opo m   � ��#�#  p qrq o   � ��"�" 0 thewidth theWidthr s�!s o   � �� �  0 	theheight 	theHeight�!  k l     t��t n      uvu 1   � ��
� 
pbndv l  � �w��w 4  � ��x
� 
cwinx m   � ��� �  �  �  �  �%   m    yy�                                                                                  rimZ  alis    \  Mac OS X                   �Y&�H+     KGoogle Chrome.app                                               ���K�E        ����  	                Applications    �Y
t      �K�       K  (Mac OS X:Applications: Google Chrome.app  $  G o o g l e   C h r o m e . a p p    M a c   O S   X  Applications/Google Chrome.app  / ��  �L  �K   z{z l  � �|��| O   � �}~} k   � � ��� I  � ����
� .prcskprsnull���     ctxt� m   � ��� ���  i� ���
� 
faal� J   � ��� ��� m   � ��
� eMdsKcmd� ��� m   � ��
� eMdsKopt�  �  � ��� I  � ����
� .prcskprsnull���     ctxt� m   � ��� ���  m� ���
� 
faal� J   � ��� ��� m   � ��
� eMdsKcmd� ��� m   � ��
� eMdsKsft�  �  � ��
� I  � ��	��
�	 .prcskprsnull���     ctxt� m   � ��� ���  m� ���
� 
faal� J   � ��� ��� m   � ��
� eMdsKcmd� ��� m   � ��
� eMdsKsft�  �  �
  ~ m   � ����                                                                                  sevs  alis    �  Mac OS X                   �Y&�H+     ,System Events.app                                               c��        ����  	                CoreServices    �Y
t      ����       ,   +   *  9Mac OS X:System: Library: CoreServices: System Events.app   $  S y s t e m   E v e n t s . a p p    M a c   O S   X  -System/Library/CoreServices/System Events.app   / ��  �  �  { ��� l     ����  �  �  � �� � l     ��������  ��  ��  �        ������������������������  � �������������������������� 0 
menu_click  �� 0 menu_click_recurse  
�� .aevtoappnull  �   � ****�� 0 
screensize 
screenSize�� 0 thewidth theWidth�� 0 	theheight 	theHeight�� 0 mytab myTab��  ��  ��  ��  ��  � �� #���������� 0 
menu_click  �� ����� �  ���� 0 mlist mList��  � ���������� 0 mlist mList�� 0 appname appName�� 0 topmenu topMenu�� 0 r  � 	�� <�� �����������
�� 
leng
�� 
cobj
�� 
prcs
�� 
mbar
�� 
mbri
�� 
menE�� 0 menu_click_recurse  �� U��,m 	)j�Y hO�[�\[Zk\Zl2E[�k/E�Z[�l/E�ZO�[�\[Zm\Z��,2E�O� )�*�/�k/�/�/l+ U� �� ����������� 0 menu_click_recurse  �� ����� �  ������ 0 mlist mList�� 0 parentobject parentObject��  � ���������� 0 mlist mList�� 0 parentobject parentObject�� 0 f  �� 0 r  � ���� ���������
�� 
cobj
�� 
leng
�� 
menI
�� .prcsclicnull��� ��� uiel
�� 
menE�� 0 menu_click_recurse  �� I��k/E�O��,k �[�\[Zl\Z��,2E�Y hO� "��,k  ��/j Y )���/�/l+ U� �����������
�� .aevtoappnull  �   � ****� k     ���  ��� �� z����  ��  ��  �  � "����������������y�������(������4����������G��������������
�� 
desk
�� 
cwin
�� 
pbnd�� 0 
screensize 
screenSize
�� 
cobj�� 0 thewidth theWidth�� �� 0 	theheight 	theHeight
�� .aevtrappnull��� ��� null
�� .miscactvnull��� ��� null�  
�� 
pnam
�� .coreclosnull���     obj 
�� 
CrTb
�� 
URL 
�� .coredelonull���     obj 
�� 
kocl
�� 
insh
�� .corecrel****      � null�� 0 mytab myTab
�� 
faal
�� eMdsKcmd
�� eMdsKopt
�� .prcskprsnull���     ctxt
�� eMdsKsft�� �� *�,�,�,EE�O��m/E�O���/E�UO� m*j 
O*j O*�-�[�,\Z�>1j O*�-a -�[a ,\Za >1j O*a a a *�k/a -6� E` Oa _ a ,FOjj���v*�k/�,FUOa  :a a a a lvl Oa a a a  lvl Oa !a a a  lvl U� ����� �  ����������  ��  ������������� �� �������� y������
�� 
cwin�� 
�� kfrmID  
�� 
CrTb��?
�� kfrmID  ��  ��  ��  ��  ��   ascr  ��ޭ