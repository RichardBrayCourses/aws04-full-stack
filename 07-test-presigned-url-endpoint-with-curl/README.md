# Testing the API Server presigned url endpoint with curl

## Call the API server endpoint to get a presigned url

Make this call to the api server in a bash terminal and it should return a presigned URL.

The API server address is reported when deploying the api server stack.

It can also be found in the AWS management console, go to the api gateway console, look in the "Dashboard" panel.

Appended to the api server gateway URL is the express server path /photos/presigned-url

```bash
curl -X POST "https://759vvmgac7.execute-api.eu-west-2.amazonaws.com/api/photos/presigned-url"
```

## Use the presigned url to upload a file

Use curl for a second time to upload the file

Here the first parameter is the presigned URL that was returned above, and "retro.jpg" is the name of the file (in the current directory) to upload

```bash
curl -X PUT "https://api-service-photosbucket2ac9d1f0-yiitzgpxpp7n.s3.eu-west-2.amazonaws.com/1cf2890b-32d9-4aec-b51d-2cd0b3f82184?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAWCWJJWAHSYRFLMV2%2F20260531%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T095336Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCWV1LXdlc3QtMiJIMEYCIQCSQrBzzvwbFm6iUqCeCWmQX1tfJYEdkMi47IUB%2BvEsNQIhAKZlemoZFzS4bM8fNHlTupJkB81Ei1Fw7oE1aRZD%2BDHKKsYECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNDE4MTA3NzMxOTgzIgx0AlQxWbYvhnBGsJwqmgRWltdGB7NTrhlVA7WuyKZBUw6mYLgapAJ9cOi6QnMBtDQweJ%2FbGXflkBnTTKhD1KoT2sRA7XIX3bSHn%2BKKKGrPGCtTqMRbcSbzt8ZoKPotrvAWbdhT9X50RexKun8rH9cJYI4K2a%2FIOtkJOaoMe8LDT%2FA%2F%2FlTxfSakxfAPuusrg%2FHpl0NNofYu0zyRMKdsLaU%2FmLVGU1nRMZpfPnHs3f8aqs7OOKGOyrnnD0Sc2hNYDW1xAV5%2FwhFiSGrt2zzKMMaTrCw%2BcoYrSF1SFT3Jx8nkyqd5xXWv3uOylRm2STcNb5ltszdI2C22aJsbUZDdWuricd2QTFFPGDE47z2xAspdollKhNi5ICP%2FaQSNQnKEUKXfEiRb6H0jZcS4UA4X8ACci1uP9MTzTA1z96ae6IaP5Zhrcf5hM98WWXv5pyt2vfTF%2BprPbwfSGSzy1CN%2BzBkKNGfdnbIF6nye8QBmNFi0A0JvgsbDMnJZ%2FHDavWRtnlve%2B84qSM%2FdCfJFsPp6l45goGjdqTUDl8thSu52EVeB05HLntkEttnWBnQtJleBqEjrIJm8bLUOVDF8%2B11eRE4yLx51lQAXdcp5tp%2FWEhNyxbxccjTsKsu907tGsLz1LqZnsZPuu5%2F%2Fb7ZVqGPF6VW8ll6q4I83BXFxDfYxJvDJsgelRx3QniDKNvz0%2F%2FG4qS8NB6oVKPquWzf%2FeS9Wrwywc8IhHyNQit0MMJ6K8NAGOqEB2n2ZcbYU3wJfXiKgnnrN7x2nkZgY6RYgdWEOVlXxTNZu3lJ3ai1L7F%2BDEewIhNZoML%2B213aPRDJccVwLF73dRHaRCrIlitx03SULZfavRk1IVZRrs9wk%2BgFCIBnVF5O9bFreOijdcs9lxsVNXBPRhWzdDMYCAwAcMFRJ0XVVpWk%2FvBuujgqAhiMmRW1OSrYiG%2B%2BBBh1dorYHIOP65Zd8IHY%3D&X-Amz-Signature=83246e78caaf7b97f8ea46bb7784df03ea62b7823eeafa17283fe083cb41f9e5&X-Amz-SignedHeaders=host&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject"  \
-H "Content-Type: image/jpeg"
--data-binary @"retro.jpg"

```
