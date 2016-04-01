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
t      ����       ,   +   *  9Mac OS X:System: Library: CoreServices: System Events.app   $  S y s t e m   E v e n t s . a p p    M a c   O S   X  -System/Library/CoreServices/System Events.app   / ��  ��   �  � � � l     �o�n�m�o  �n  �m   �  � � � l    
 ��l�k � O     
 � � � I   	�j�i�h
�j .aevtrappnull��� ��� null�i  �h   � m      � ��                                                                                  sfri  alis    B  Mac OS X                   �Y&�H+     K
Safari.app                                                       ��ѮI�        ����  	                Applications    �Y
t      Ѯ�       K  !Mac OS X:Applications: Safari.app    
 S a f a r i . a p p    M a c   O S   X  Applications/Safari.app   / ��  �l  �k   �  � � � l     �g�f�e�g  �f  �e   �  � � � l    ��d�c � r     � � � I   �b�a�`
�b .misccurdldt    ��� null�a  �`   � o      �_�_ 0 thistime thisTime�d  �c   �  � � � l    ��^�] � r     � � � [     � � � o    �\�\ 0 thistime thisTime � m    �[�[  � o      �Z�Z 0 dropdeadtime dropDeadTime�^  �]   �  � � � l   l ��Y�X � T    l � � k    g � �  � � � Z    - � ��W�V � ?    % � � � l   # ��U�T � I   #�S�R�Q
�S .misccurdldt    ��� null�R  �Q  �U  �T   � o   # $�P�P 0 dropdeadtime dropDeadTime �  S   ( )�W  �V   �  ��O � Q   . g � � � � k   1 T � �  �  � I   1 <�N�M�N 0 
menu_click   �L J   2 8  m   2 3 �  S a f a r i 	 m   3 4

 �  D e v e l o p	  m   4 5 �  S i m u l a t o r �K m   5 6 � , l o c a l h o s t      i n d e x . h t m l�K  �L  �M     O   = G I  A F�J�I�H
�J .miscactvnull��� ��� null�I  �H   m   = >                                                                                      @ alis    �  Mac OS X                   �Y&�H+   ���Simulator.app                                                   ����(�        ����  	                Applications    �Y
t      ���     ��� ��� ��� ���   K  RMac OS X:Applications: Xcode.app: Contents: Developer: Applications: Simulator.app    S i m u l a t o r . a p p    M a c   O S   X  DApplications/Xcode.app/Contents/Developer/Applications/Simulator.app  / ��    O   H R I  L Q�G�F�E
�G .miscactvnull��� ��� null�F  �E   m   H I�                                                                                  sfri  alis    B  Mac OS X                   �Y&�H+     K
Safari.app                                                       ��ѮI�        ����  	                Applications    �Y
t      Ѯ�       K  !Mac OS X:Applications: Safari.app    
 S a f a r i . a p p    M a c   O S   X  Applications/Safari.app   / ��   �D  S   S T�D   � R      �C�B
�C .ascrerr ****      � **** o      �A�A 0 errtext errText�B   � k   \ g  !  I  \ a�@"�?
�@ .ascrcmnt****      � ****" o   \ ]�>�> 0 errtext errText�?  ! #�=# I  b g�<$�;
�< .sysodelanull��� ��� nmbr$ m   b c�:�: �;  �=  �O  �Y  �X   � %&% l     �9�8�7�9  �8  �7  & '(' l     �6�5�4�6  �5  �4  ( )*) l     �3�2�1�3  �2  �1  * +�0+ l     �/�.�-�/  �.  �-  �0       �,,-./01�+�,  , �*�)�(�'�&�%�* 0 
menu_click  �) 0 menu_click_recurse  
�( .aevtoappnull  �   � ****�' 0 thistime thisTime�& 0 dropdeadtime dropDeadTime�%  - �$ #�#�"23�!�$ 0 
menu_click  �# � 4�  4  �� 0 mlist mList�"  2 ����� 0 mlist mList� 0 appname appName� 0 topmenu topMenu� 0 r  3 	� <� ������
� 
leng
� 
cobj
� 
prcs
� 
mbar
� 
mbri
� 
menE� 0 menu_click_recurse  �! U��,m 	)j�Y hO�[�\[Zk\Zl2E[�k/E�Z[�l/E�ZO�[�\[Zm\Z��,2E�O� )�*�/�k/�/�/l+ U. � ���56�� 0 menu_click_recurse  � �7� 7  ��� 0 mlist mList� 0 parentobject parentObject�  5 ���
�	� 0 mlist mList� 0 parentobject parentObject�
 0 f  �	 0 r  6 �� �����
� 
cobj
� 
leng
� 
menI
� .prcsclicnull��� ��� uiel
� 
menE� 0 menu_click_recurse  � I��k/E�O��,k �[�\[Zl\Z��,2E�Y hO� "��,k  ��/j Y )���/�/l+ U/ �8�� 9:��
� .aevtoappnull  �   � ****8 k     l;;  �<<  �==  �>>  �����  �  �   9 ���� 0 errtext errText:  �����������
��������������
�� .aevtrappnull��� ��� null
�� .misccurdldt    ��� null�� 0 thistime thisTime�� �� 0 dropdeadtime dropDeadTime�� �� 0 
menu_click  
�� .miscactvnull��� ��� null�� 0 errtext errText��  
�� .ascrcmnt****      � ****
�� .sysodelanull��� ��� nmbr�� m� *j UO*j E�O��E�O RhZ*j � Y hO (*�����vk+ O� *j UO� *j UOW X  �j Okj [OY��0 ldt     �$&y1 ldt     �$&��+  ascr  ��ޭ