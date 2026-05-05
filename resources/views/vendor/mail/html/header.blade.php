@props(['url'])
<tr>
<td class="header" style="padding: 0;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td style="background-color: #000000; padding: 22px 40px;">
<a href="{{ $url }}" style="display: inline-block; text-decoration: none; line-height: 1;">
    <img
        src="{{ config('app.url') }}/logo.svg"
        alt="Transporteri"
        width="180"
        height="36"
        style="display: block; border: 0;"
    >
</a>
</td>
</tr>
</table>
</td>
</tr>
