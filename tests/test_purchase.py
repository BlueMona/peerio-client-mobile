import StringIO
import pycurl, json

def postreceipt(url, receipt64):
    data = json.dumps({"receipt-data": receipt64, "password": "***REMOVED***"})
    print data
    buffer = StringIO.StringIO()
    c = pycurl.Curl()
    c.setopt(c.URL, url)
    c.setopt(c.WRITEDATA, buffer)
    c.setopt(pycurl.POST, 1)
    c.setopt(pycurl.POSTFIELDS, data)
    c.perform()
    c.close()
    return buffer.getvalue()

receipt = "ewoJInNpZ25hdHVyZSIgPSAiQXlUd2lUeTRjOThzU3hJY0xVQ2tsOFRFQUJldk43M0Y5S3lsd2dES2NZRXNDeSt5dDcwN1ZVUkhkajdrRzRIcmlxN2xIaFVTaEdEaFkvM2pYUE8zVS9jckZrRmhaeEhnSitRSTBoTTB6VTlQdCs3L2IxZ0lSbFViMjVjdC9qR29taEROVlBhWndSTENKaHdvQmk1QkljLzhDWTlKMEd4clpQMThHdU9BM3lTVkNxeWdLd3pDSzFWMElnSHVEKzIzK0U0aWNCdzhOVmVORldnNmlZUFU3RFVlWUxDSitGU3FpUmRmV0NURDNrTC9CVjlPWnZVdWc4TFY3Sis3Z0dzYkRwZmFBY2VVNkxWV3QyWC9rMHpiRVREN1lsOUU3SG9LZytLVElWQUlNcGVaTVlsK2dXZ0MwT3dHSDNvb09tcEpNS1Q3R2ZsdkltV1lRTHJhTmo4Y1BIWUFBQVdBTUlJRmZEQ0NCR1NnQXdJQkFnSUlEdXRYaCtlZUNZMHdEUVlKS29aSWh2Y05BUUVGQlFBd2daWXhDekFKQmdOVkJBWVRBbFZUTVJNd0VRWURWUVFLREFwQmNIQnNaU0JKYm1NdU1Td3dLZ1lEVlFRTERDTkJjSEJzWlNCWGIzSnNaSGRwWkdVZ1JHVjJaV3h2Y0dWeUlGSmxiR0YwYVc5dWN6RkVNRUlHQTFVRUF3dzdRWEJ3YkdVZ1YyOXliR1IzYVdSbElFUmxkbVZzYjNCbGNpQlNaV3hoZEdsdmJuTWdRMlZ5ZEdsbWFXTmhkR2x2YmlCQmRYUm9iM0pwZEhrd0hoY05NVFV4TVRFek1ESXhOVEE1V2hjTk1qTXdNakEzTWpFME9EUTNXakNCaVRFM01EVUdBMVVFQXd3dVRXRmpJRUZ3Y0NCVGRHOXlaU0JoYm1RZ2FWUjFibVZ6SUZOMGIzSmxJRkpsWTJWcGNIUWdVMmxuYm1sdVp6RXNNQ29HQTFVRUN3d2pRWEJ3YkdVZ1YyOXliR1IzYVdSbElFUmxkbVZzYjNCbGNpQlNaV3hoZEdsdmJuTXhFekFSQmdOVkJBb01Da0Z3Y0d4bElFbHVZeTR4Q3pBSkJnTlZCQVlUQWxWVE1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcGMrQi9TV2lnVnZXaCswajJqTWNqdUlqd0tYRUpzczl4cC9zU2cxVmh2K2tBdGVYeWpsVWJYMS9zbFFZbmNRc1VuR09aSHVDem9tNlNkWUk1YlNJY2M4L1cwWXV4c1FkdUFPcFdLSUVQaUY0MWR1MzBJNFNqWU5NV3lwb041UEM4cjBleE5LaERFcFlVcXNTNCszZEg1Z1ZrRFV0d3N3U3lvMUlnZmRZZUZScjZJd3hOaDlLQmd4SFZQTTNrTGl5a29sOVg2U0ZTdUhBbk9DNnBMdUNsMlAwSzVQQi9UNXZ5c0gxUEttUFVockFKUXAyRHQ3K21mNy93bXYxVzE2c2MxRkpDRmFKekVPUXpJNkJBdENnbDdaY3NhRnBhWWVRRUdnbUpqbTRIUkJ6c0FwZHhYUFEzM1k3MkMzWmlCN2o3QWZQNG83UTAvb21WWUh2NGdOSkl3SURBUUFCbzRJQjF6Q0NBZE13UHdZSUt3WUJCUVVIQVFFRU16QXhNQzhHQ0NzR0FRVUZCekFCaGlOb2RIUndPaTh2YjJOemNDNWhjSEJzWlM1amIyMHZiMk56Y0RBekxYZDNaSEl3TkRBZEJnTlZIUTRFRmdRVWthU2MvTVIydDUrZ2l2Uk45WTgyWGUwckJJVXdEQVlEVlIwVEFRSC9CQUl3QURBZkJnTlZIU01FR0RBV2dCU0lKeGNKcWJZWVlJdnM2N3IyUjFuRlVsU2p0ekNDQVI0R0ExVWRJQVNDQVJVd2dnRVJNSUlCRFFZS0tvWklodmRqWkFVR0FUQ0IvakNCd3dZSUt3WUJCUVVIQWdJd2diWU1nYk5TWld4cFlXNWpaU0J2YmlCMGFHbHpJR05sY25ScFptbGpZWFJsSUdKNUlHRnVlU0J3WVhKMGVTQmhjM04xYldWeklHRmpZMlZ3ZEdGdVkyVWdiMllnZEdobElIUm9aVzRnWVhCd2JHbGpZV0pzWlNCemRHRnVaR0Z5WkNCMFpYSnRjeUJoYm1RZ1kyOXVaR2wwYVc5dWN5QnZaaUIxYzJVc0lHTmxjblJwWm1sallYUmxJSEJ2YkdsamVTQmhibVFnWTJWeWRHbG1hV05oZEdsdmJpQndjbUZqZEdsalpTQnpkR0YwWlcxbGJuUnpMakEyQmdnckJnRUZCUWNDQVJZcWFIUjBjRG92TDNkM2R5NWhjSEJzWlM1amIyMHZZMlZ5ZEdsbWFXTmhkR1ZoZFhSb2IzSnBkSGt2TUE0R0ExVWREd0VCL3dRRUF3SUhnREFRQmdvcWhraUc5Mk5rQmdzQkJBSUZBREFOQmdrcWhraUc5dzBCQVFVRkFBT0NBUUVBRGFZYjB5NDk0MXNyQjI1Q2xtelQ2SXhETUlKZjRGelJqYjY5RDcwYS9DV1MyNHlGdzRCWjMrUGkxeTRGRkt3TjI3YTQvdncxTG56THJSZHJqbjhmNUhlNXNXZVZ0Qk5lcGhtR2R2aGFJSlhuWTR3UGMvem83Y1lmcnBuNFpVaGNvT0FvT3NBUU55MjVvQVE1SDNPNXlBWDk4dDUvR2lvcWJpc0IvS0FnWE5ucmZTZW1NL2oxbU9DK1JOdXhUR2Y4YmdwUHllSUdxTktYODZlT2ExR2lXb1IxWmRFV0JHTGp3Vi8xQ0tuUGFObVNBTW5CakxQNGpRQmt1bGhnd0h5dmozWEthYmxiS3RZZGFHNllRdlZNcHpjWm04dzdISG9aUS9PamJiOUlZQVlNTnBJcjdONFl0UkhhTFNQUWp2eWdhWndYRzU2QWV6bEhSVEJoTDhjVHFBPT0iOwoJInB1cmNoYXNlLWluZm8iID0gImV3b0pJbTl5YVdkcGJtRnNMWEIxY21Ob1lYTmxMV1JoZEdVdGNITjBJaUE5SUNJeU1ERTJMVEExTFRJMElERXpPakk0T2pNMUlFRnRaWEpwWTJFdlRHOXpYMEZ1WjJWc1pYTWlPd29KSW5CMWNtTm9ZWE5sTFdSaGRHVXRiWE1pSUQwZ0lqRTBOalF4TWpFM01EZzVOVFlpT3dvSkluVnVhWEYxWlMxcFpHVnVkR2xtYVdWeUlpQTlJQ0psT1dFM00yTXdNamc1T1RRMk1UY3hNakk1WkdNNU9EZ3haVFJpTkdVeU1EQTVaV0V6TjJVNUlqc0tDU0p2Y21sbmFXNWhiQzEwY21GdWMyRmpkR2x2YmkxcFpDSWdQU0FpTVRBd01EQXdNREl4TXpNMk5Ua3hNQ0k3Q2draVpYaHdhWEpsY3kxa1lYUmxJaUE5SUNJeE5EWTBNVEl5TURBNE9UVTJJanNLQ1NKMGNtRnVjMkZqZEdsdmJpMXBaQ0lnUFNBaU1UQXdNREF3TURJeE16TTJOVGt4TUNJN0Nna2liM0pwWjJsdVlXd3RjSFZ5WTJoaGMyVXRaR0YwWlMxdGN5SWdQU0FpTVRRMk5ERXlNVGN4TlRJMU5pSTdDZ2tpZDJWaUxXOXlaR1Z5TFd4cGJtVXRhWFJsYlMxcFpDSWdQU0FpTVRBd01EQXdNREF6TWpVNE1UYzROU0k3Q2draVluWnljeUlnUFNBaU1DSTdDZ2tpZFc1cGNYVmxMWFpsYm1SdmNpMXBaR1Z1ZEdsbWFXVnlJaUE5SUNJME16QkJRMFpFTlMwek1qaERMVFF5TUVZdE9EZzFOQzB4TjBKRU9EUTVNemd4TURraU93b0pJbVY0Y0dseVpYTXRaR0YwWlMxbWIzSnRZWFIwWldRdGNITjBJaUE5SUNJeU1ERTJMVEExTFRJMElERXpPak16T2pJNElFRnRaWEpwWTJFdlRHOXpYMEZ1WjJWc1pYTWlPd29KSW1sMFpXMHRhV1FpSUQwZ0lqRXhNVEU1TkRjNE5ETWlPd29KSW1WNGNHbHlaWE10WkdGMFpTMW1iM0p0WVhSMFpXUWlJRDBnSWpJd01UWXRNRFV0TWpRZ01qQTZNek02TWpnZ1JYUmpMMGROVkNJN0Nna2ljSEp2WkhWamRDMXBaQ0lnUFNBaVkyOXRMbkJsWlhKcGJ5NXpkRzl5WVdkbExqVXdMbTF2Ym5Sb2JIa2lPd29KSW5CMWNtTm9ZWE5sTFdSaGRHVWlJRDBnSWpJd01UWXRNRFV0TWpRZ01qQTZNamc2TWpnZ1JYUmpMMGROVkNJN0Nna2liM0pwWjJsdVlXd3RjSFZ5WTJoaGMyVXRaR0YwWlNJZ1BTQWlNakF4Tmkwd05TMHlOQ0F5TURveU9Eb3pOU0JGZEdNdlIwMVVJanNLQ1NKaWFXUWlJRDBnSW1OdmJTNXdaV1Z5YVc4aU93b0pJbkIxY21Ob1lYTmxMV1JoZEdVdGNITjBJaUE5SUNJeU1ERTJMVEExTFRJMElERXpPakk0T2pJNElFRnRaWEpwWTJFdlRHOXpYMEZ1WjJWc1pYTWlPd29KSW5GMVlXNTBhWFI1SWlBOUlDSXhJanNLZlE9PSI7CgkiZW52aXJvbm1lbnQiID0gIlNhbmRib3giOwoJInBvZCIgPSAiMTAwIjsKCSJzaWduaW5nLXN0YXR1cyIgPSAiMCI7Cn0="

url = "https://sandbox.itunes.apple.com/verifyReceipt"
print postreceipt(url, receipt)