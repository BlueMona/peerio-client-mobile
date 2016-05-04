from lxml import etree

if __name__ == "__main__":
    fName = 'platforms/android/AndroidManifest.xml'
    tree = etree.parse(fName)
    e = tree.getroot()
    # e.set("{http://schemas.android.com/}tools", "http://schemas.android.com/tools")
    aNode = e.find('application')
    aNode.set("{http://schemas.android.com/apk/res/android}debuggable", "true")
    # aNode.set("tools:ignore", "HardcodedDebugMode")
    tree.write(fName, encoding='utf-8', xml_declaration=True)

