<?php

/* logo options */
$nt_conversi_logo_option = ( ot_get_option( 'nt_conversi_logo_type' ) );
$nt_conversi_img_whitelogo = ( ot_get_option( 'nt_conversi_whitelogoimg' ) );
$nt_conversi_img_darklogo = ( ot_get_option( 'nt_conversi_darklogoimg' ) );
$nt_conversi_text_logo = ( ot_get_option( 'nt_conversi_textlogo' ) );
$nt_conversi_btn_display = ( ot_get_option( 'nt_conversi_menubtn_display' ) );
$nt_conversi_menubtn = ( ot_get_option( 'nt_conversi_menubtn' ) );
$nt_conversi_menubtnurl = ( ot_get_option( 'nt_conversi_menubtnurl' ) );
$nt_conversi_menubtntarget = ( ot_get_option( 'nt_conversi_menubtntarget' ) );

$nt_conversi_logo_target = ot_get_option( 'nt_conversi_logo_target' );
$nt_conversi_logo_target = ( $nt_conversi_logo_target != '' ) ? ' target="'. esc_attr( $nt_conversi_logo_target ) .'"' : '';
$nt_conversi_logo_link = ot_get_option( 'nt_conversi_logo_link' );
$nt_conversi_logo_customlink = ( $nt_conversi_logo_link != '' ) ? $nt_conversi_logo_link : home_url( '/' );
?>
<header id="header">
    <nav id="navigation_mobile">
        <div class="nav-menu-links">
            <?php
            wp_nav_menu( array(
                'menu' => 'primary',
                'theme_location' => 'primary',
                'depth' => 3,
                'container' => '',
                'container_class' => '',
                'menu_class' => 'primary-menu',
                'menu_id' => 'primary-menu-mobile-affix',
                'echo' => true,
                'fallback_cb' => 'Nt_Conversi_Wp_Bootstrap_Navwalker::fallback',
                'walker' => new Nt_Conversi_Wp_Bootstrap_Navwalker()
            ));
            ?>
        </div>
        <div class="nav-menu-button">
            <button class="nav-menu-toggle"><i class="fa fa-navicon"></i></button>
        </div>
    </nav>
    <nav id="navigation" class="navbar scrollspy">
        <div class="container">
            <div class="navbar-brand">
                <?php if ( $nt_conversi_logo_option == 'text' || $nt_conversi_logo_option == '' ) : ?>
                    <?php if ( $nt_conversi_text_logo != '' ) : ?>
                        <?php
                        printf('<a href="%s" %s class="text-logo">%s</a>',
                        esc_url( $nt_conversi_logo_customlink ),
                        $nt_conversi_logo_target ? ' target="'.esc_attr( $nt_conversi_logo_target).'"' : '',
                        esc_html( $nt_conversi_text_logo )
                        );
                        ?>
                    <?php  else : ?>
                        <a href="<?php echo esc_url( $nt_conversi_logo_customlink ); ?>" class="text-logo site-name"><?php echo esc_attr( get_bloginfo( 'name' ) ); ?></a>
                    <?php endif; ?>
                <?php endif; ?>

                <?php if ( $nt_conversi_logo_option == 'img' && $nt_conversi_img_whitelogo ) : ?>
                    <?php
                    printf('<a href="%s" %s class="img-logo"><img class="responsive-img" src="%s" alt="%s"></a>',
                    esc_url( $nt_conversi_logo_customlink ),
                    $nt_conversi_logo_target ? ' target="'.esc_attr( $nt_conversi_logo_target).'"' : '',
                    esc_url( $nt_conversi_img_whitelogo ),
                    esc_attr( get_bloginfo( 'name' ) )
                    );
                    ?>
                <?php endif; ?>
            </div>
            <?php
            wp_nav_menu( array(
                'menu' => 'primary',
                'theme_location' => 'primary',
                'depth' => 3,
                'container' => '',
                'container_class' => '',
                'menu_class' => 'nav navbar-nav primary-menu',
                'menu_id' => 'primary-menu-affix',
                'echo' => true,
                'fallback_cb' => 'Nt_Conversi_Wp_Bootstrap_Navwalker::fallback',
                'walker' => new Nt_Conversi_Wp_Bootstrap_Navwalker()
            ));
            ?>
        </div>
    </nav>
    <nav id="navigation_affix" class="scrollspy">
        <div class="container">
            <div class="navbar-brand">
                <?php if ( $nt_conversi_logo_option == 'text' || $nt_conversi_logo_option == '' ) : ?>
                    <?php if ( $nt_conversi_text_logo ) : ?>
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="text-logo"><?php echo esc_html( $nt_conversi_text_logo ); ?></a>
                    <?php  else : ?>
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="text-logo site-name"><?php echo esc_attr( get_bloginfo( 'name' ) ); ?></a>
                    <?php endif; ?>
                <?php endif; ?>

                <?php if ( $nt_conversi_logo_option == 'img' && $nt_conversi_img_darklogo ) : ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="img-logo">
                        <img class="responsive-img" src="<?php echo esc_url( $nt_conversi_img_darklogo ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
                    </a>
                <?php endif; ?>
            </div>
            <?php
            wp_nav_menu( array(
                'menu' => 'primary',
                'theme_location' => 'primary',
                'depth' => 3,
                'container' => '',
                'container_class' => '',
                'menu_class' => 'nav navbar-nav primary-menu',
                'menu_id' => 'primary-menu-affix',
                'echo' => true,
                'fallback_cb' => 'Nt_Conversi_Wp_Bootstrap_Navwalker::fallback',
                'walker' => new Nt_Conversi_Wp_Bootstrap_Navwalker()
            ));
            ?>
        </div>
    </nav>

</header>
