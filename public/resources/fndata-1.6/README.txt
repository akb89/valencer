Welcome to Release 1.6 of the FrameNet data!

Contents of this release:

The FrameNet database in XML format, with XSL scripts to make the data
readable in a web browser:

     frame/        (one file/frame)
     frameIndex.xml	  
     frameIndex.xsl	  
     frRelation.xml	
     fulltext/	   (one file/document)
     fulltextIndex.xml 
     fulltextIndex.xsl 
     lu            (one file/lexical unit, 13,190 files)
     luIndex.xml	  
     luIndex.xsl	  
     		  
     schema/       XML schemas for the data
     semTypes.xml  FrameNet semantic types

Documentation:

     docs/ 
          book.pdf FrameNet II: Extended Theory and Practice:
          Annotator's manual, 119 pages

	  GeneralReleaseNotes1.6.pdf: description of changes in
	  Release 1.6 

	  R1.5XMLDocumentation.txt: A very detailed description of the
	  XML formats used; almost all of this is still relevant for R1.6.

     miscXML/
          DifferencesR1.5-1.6.xml: automatic diff file showing all
          additions, deletions and name changes for frames, FEs and LUs.

          XML representation of the lemma, lexeme and wordform data in
          FrameNet:
               lemma_to_wordform.xml
     	       lexeme_to_wordform.xml

README.txt: this file

-----------------------------------------------------


If you just want to start looking at the data, you should be able to
open any one of the index files (frameIndex.xml, luIndex.xml or
fulltextIndex.xml) in a web browser and browse through it. We have
confirmed that the combination of XML and XSL/Javascript that we are
using works correctly with all major browsers on the current versions
of Mac OS X, Microsoft Windows, and Red Hat Linux; on Debian Linux
only Firefox and Chrome seem to work; Konqueror, Lynx, Midori, and
Dillo do not seem to work with our data on any OS.

Next, please read the documentation (in the /docs directory): the file
GeneralReleaseNotes1.6.pdf will tell you about what is different in
this release, including the new files in the miscXML directory. The
file R1.5XMLDocumentation.txt gives the basic information about the
XML/XSL format, but is somewhat out of date.  "The Book" (formally
"FrameNet II: Extended Theory and Practice" as printed on September
14, 2010) gives a great deal more detail of the theory behind FrameNet
and the principles followed in the annotation, but is also out of
date.  We plan to update both of these documents in the near future,
and will post news of this on the FrameNet website; in the meantime,
the General Release Notes will give a summary of the improvements
found in the current release.

As always, the FrameNet project public website, at

    http://framenet.icsi.berkeley.edu

contains much more information and current news.  Thank you for your
interest in FrameNet.

Sincerely,

Collin F. Baker
Project Manager, FrameNet
http://framenet.icsi.berkeley.edu/
International Computer Science Institute
1947 Center St. Suite 600
Berkeley, California, 94704

collinb@icsi.berkeley.edu

July 7, 2015
